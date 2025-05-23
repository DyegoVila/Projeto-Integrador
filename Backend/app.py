from flask import Flask, request,  session, jsonify
import sqlite3
from flask_cors import CORS

app = Flask(__name__)
app.secret_key = 'chave-secreta'
CORS(app)  # Libera CORS para todas as rotas e origens


def get_db_connection():
    conn = sqlite3.connect('banco.db')
    conn.row_factory = sqlite3.Row
    return conn 

# Login: recebe JSON { "usuario": "...", "senha": "..." }
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    usuario = data.get('usuario')
    senha = data.get('senha')

    conn = get_db_connection()
    cursor = conn.execute('SELECT id, login FROM usuarios WHERE login = ? AND senha = ?', (usuario, senha))
    user = cursor.fetchone()
    conn.close()

    # Aqui você pode validar no banco ou deixar fixo como antes
    if user:
        session['usuario'] = usuario
        return jsonify({'status': 'sucesso', 'id': user['id'], 'username': user['username']}), 200
    else:
        return jsonify({'status': 'erro', 'mensagem': 'Usuário ou senha inválidos'}), 401

# Cadastro: recebe JSON { "username": "...", "password": "..." }
@app.route('/cadastro', methods=['POST'])
def cadastro():
    data = request.json
    usuario = data.get('username')
    senha = data.get('password')

    conn = get_db_connection()
    try:
        conn.execute('INSERT INTO usuarios (username, password) VALUES (?, ?)', (usuario, senha))
        conn.commit()
        return jsonify({"message": "Usuário cadastrado com sucesso!"}), 201
    except sqlite3.IntegrityError:
        return jsonify({"error": "Usuário já existe."}), 409
    finally:
        conn.close()

# Lista usuários
@app.route('/users', methods=['GET'])
def users():
    conn = get_db_connection()
    usuarios = conn.execute('SELECT id, username FROM usuarios').fetchall()
    conn.close()
    resultado = [dict(usuario) for usuario in usuarios]
    return jsonify(resultado)

# Logout
@app.route('/logout', methods=['POST'])
def logout():
    session.pop('usuario', None)
    return jsonify({"message": "Logout efetuado"}), 200

if __name__ == '__main__':
    app.run(debug=True)
