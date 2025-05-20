from flask import Flask, render_template, request, redirect, url_for, session, flash
import sqlite3
import os

template_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'Frontend', 'templates'))


app = Flask(__name__, template_folder=template_path)
app.secret_key = 'chave-secreta'

# Página de login
@app.route('/', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        usuario = request.form['usuario']
        senha = request.form['senha']
        
        if usuario == 'admin' and senha == '1234':
            return redirect(url_for('dashboard'))
        else:
            return render_template('login.html', erro='Credenciais inválidas')
    return render_template('login.html')

# Página home
@app.route('/home')
def home():
    if 'usuario' in session:
        return render_template('home.html', usuario=session['usuario'])
    else:
        flash('Você precisa estar logado.')
        return redirect(url_for('login'))

# Página dashboard
@app.route('/dashboard')
def dashboard():
    if 'usuario' in session:
        return render_template('home.html', usuario=session['usuario'])
    else:
        flash('Você precisa estar logado.')
    return render_template('dashboard.html')

if __name__ == '__main__':
    app.run(debug=True)

# Banco

def get_db_connection():
    conn = sqlite3.connect('banco.db')
    conn.row_factory = sqlite3.Row
    return conn 

# rota de cadastro

@app.route('/cadastro', methods=['GET', 'POST'])
def cadastro():
    if request.method == 'POST':
        usuario = request.form['username']
        senha = request.form['password']
        
        conn = get_db_connection()
        try:
            conn.execute('INSERT INTO usuarios (username, password) VALUES (?, ?)', (usuario, senha))
            conn.commit()
            flash('Usuário cadastrado com sucesso!')
            return redirect(url_for('login'))
        except sqlite3.IntegrityError:
            flash('Usuário já existe.')
            return redirect(url_for('cadastro'))
        finally:
            conn.close()
    
    return render_template('cadastro.html')

# Rota de logout
@app.route('/logout')
def logout():
    session.pop('usuario', None)
    return redirect(url_for('login'))

if __name__ == "__main__":
    app.run(debug=True)