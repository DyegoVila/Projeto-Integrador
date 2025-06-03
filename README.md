# 📊 Projeto Integrador - Sistema Web

Este projeto é um sistema web desenvolvido como parte de um Projeto Integrador da faculdade. Ele é dividido em duas partes principais:

- **Frontend**: Interface do usuário com arquivos HTML.
- **Backend**: API em Flask com persistência de dados utilizando SQLite.

---

## 📁 Estrutura do Projeto

```
Projeto-Integrador/
├── Frontend/
│   └── templates/
│       ├── index.html
│       ├── login.html
|       ├── dashboard
│       └── cadastro.html
|
│
├── Backend/
│   ├── app.py
│   ├── banco.db
│   ├── requirements.txt
│   └── ...
```

---

## 🚀 Como Executar o Projeto

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/seu-repo.git
cd Projeto-Integrador/Backend
```

### 2. Crie e ative o ambiente virtual

```bash
python -m venv venv
source venv/bin/activate        # Linux/macOS
venv\Scripts\activate           # Windows
```

### 3. Instale as dependências

```bash
pip install -r requirements.txt
```

### 4. Inicie o servidor Flask

```bash
export FLASK_APP=app.py
export FLASK_ENV=development   # habilita recarregamento automático (opcional)
flask run
```

> O backend estará acessível via: `http://127.0.0.1:5000`

---

## 🌐 Acessando o Frontend

Os arquivos HTML estão localizados na pasta `Frontend/templates`. Eles podem ser usados como páginas estáticas ou renderizados dinamicamente pelo Flask, conforme a necessidade.

---

## 📡 API - Endpoints Disponíveis

- `POST /login`  
  Autentica o usuário.

- `POST /cadastro`  
  Cadastra um novo usuário.

- `GET /users`  
  Retorna a lista de usuários em JSON.

- `GET /logout`  
  Finaliza a sessão do usuário.

---

## 🛠 Tecnologias Utilizadas

- Python 3.x
- Flask
- SQLite
- HTML5
- Bootstrap (opcional no frontend)

---

## 🔐 CORS

O CORS está habilitado para permitir que aplicações frontend externas (como apps em outras portas) acessem a API livremente.

```python
from flask_cors import CORS
CORS(app)
```

---

## 📌 Observações

- As credenciais padrão são:
  - **Usuário**: `admin`
  - **Senha**: `1234`
- O banco de dados (`banco.db`) é criado automaticamente ao rodar o projeto pela primeira vez, caso não exista.

---

## 🤝 Contribuição

Sinta-se à vontade para abrir _issues_ ou enviar _pull requests_. Sugestões são sempre bem-vindas!

---

## 🧑‍💻 Autores

**Emanuel Lázaro, Dyego Vila e Raul**
