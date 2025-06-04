// Utilidades
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Carrega eventos da API e renderiza na tabela
async function carregarEventos() {
  const eventosBody = document.getElementById("eventosBody");
  eventosBody.innerHTML = "";

  try {
    const response = await fetch("http://127.0.0.1:5000/eventos");
    const eventos = await response.json();

    eventos.forEach((evento) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${evento.nome}</td>
        <td><span class="categoria ${evento.categoria}">${capitalize(
        evento.categoria
      )}</span></td>
        <td>${evento.data}</td>
        <td><span class="status ${evento.status}">${capitalize(
        evento.status
      )}</span></td>
        <td class="acoes">
          <button class="btn btn-editar" data-id="${
            evento.id
          }">📝 Editar</button>
          <button class="btn btn-secondary btn-excluir" data-id="${
            evento.id
          }">🗑️ Excluir</button>
        </td>`;
      const btnEditar = tr.querySelector(".btn-editar");
      const btnExcluir = tr.querySelector(".btn-excluir");
      btnEditar.addEventListener("click", () => editarEventos(evento));
      btnExcluir.addEventListener("click", () => excluirEvento(evento.id));

      eventosBody.appendChild(tr);
    });
  } catch (error) {
    console.error("Erro ao carregar eventos:", error);
  }
}

async function excluirEvento(id) {
  if (!confirm("Tem certeza que deseja excluir este evento?")) return;

  try {
    const response = await fetch(`http://127.0.0.1:5000/eventos/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      alert("Evento excluído com sucesso.");
      carregarEventos();
    } else {
      console.error("Erro ao excluir evento:", await response.text());
    }
  } catch (error) {
    console.error("Erro:", error);
  }
}

function fecharModal() {
  const modalOverlay = document.getElementById("modal-overlay");
  modalOverlay.classList.remove("active");
  // Limpa os campos do formulário
  document.getElementById("nome-evento").value = "";
  document.getElementById("categoria-evento").value = "";
  document.getElementById("data-evento").value = "";

  // Restaura o título e texto do botão, se quiser
  document.getElementById("modal-title").innerText = "Novo Evento";
  document.getElementById("btn-criar").innerText = "Criar Evento";

  // Remove qualquer função pendente no botão para evitar sobrescrita
  document.getElementById("btn-criar").onclick = criarNovoEvento;
}

// Modal de Novo Evento
function configurarModalNovoEvento() {
  const btnNovoEvento = document.getElementById("btn-novo-evento");
  const modalOverlay = document.getElementById("modal-overlay");
  const modalClose = document.querySelector(".modal-close");
  const btnCancelar = document.getElementById("btn-cancelar");
  const btnCriar = document.getElementById("btn-criar");
  const btnEditar = document.getElementById("btn-editar");
  btnCriar.style.display = "block";
  btnEditar.style.display = "none";

  btnNovoEvento.addEventListener("click", () =>
    modalOverlay.classList.add("active")
  );
  modalClose.addEventListener("click", fecharModal);
  btnCancelar.addEventListener("click", fecharModal);

  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) fecharModal();
  });

  btnCriar.addEventListener("click", async () => {
    const nome = document.getElementById("nome-evento").value;
    const categoria = document.getElementById("categoria-evento").value;
    const data = document.getElementById("data-evento").value;

    if (nome && categoria && data) {
      const evento = { nome, categoria, data, status: "pendente" };

      try {
        const response = await fetch("http://127.0.0.1:5000/eventos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ evento }),
        });

        const data = await response.json();
        fecharModal();
        carregarEventos(); // Atualiza lista após inserção
      } catch (error) {
        console.error("Erro:", error);
      }
    } else {
      alert("Por favor, preencha todos os campos.");
    }
  });
}

// Menu de Navegação
function configurarMenu() {
  const sidenav = document.getElementById("sidenav");
  const navToggle = document.getElementById("nav-toggle");
  const mobileNavToggle = document.getElementById("mobile-nav-toggle");
  const userProfile = document.getElementById("user-profile");
  const profileName = document.getElementById("profile-name");
  const profileRole = document.getElementById("profile-role");
  const profileDropdown = document.getElementById("profile-dropdown");
  const profileToggle = document.querySelector(".profile-toggle");
  const logout = document.getElementById("logout");

  const usuario = localStorage.getItem("usuario");
  const cargo = atob(localStorage.getItem("cargo")?.replace(/"/g, "") || "");

  if (usuario) {
    profileName.textContent = usuario.replace(/"/g, "");
    profileRole.textContent = cargo;
  }

  logout.addEventListener("click", () => localStorage.clear());

  navToggle?.addEventListener("click", () =>
    sidenav.classList.toggle("expanded")
  );
  mobileNavToggle?.addEventListener("click", () =>
    sidenav.classList.toggle("expanded")
  );

  if (userProfile) {
    userProfile.addEventListener("click", (e) => {
      profileDropdown.classList.toggle("show");
      profileToggle.style.transform = profileDropdown.classList.contains("show")
        ? "rotate(180deg)"
        : "rotate(0)";
      e.stopPropagation();
    });
    document.addEventListener("click", () => {
      profileDropdown.classList.remove("show");
      profileToggle.style.transform = "rotate(0)";
    });
  }

  const menuLinks = document.querySelectorAll(".menu-link:not(.disabled)");
  menuLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      menuLinks.forEach((item) => item.classList.remove("active"));
      this.classList.add("active");
      if (window.innerWidth <= 576) sidenav.classList.remove("expanded");
      if (this.getAttribute("href") === "#") e.preventDefault();
    });
  });

  document.querySelectorAll(".menu-link.disabled").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      alert("Esta funcionalidade ainda não está disponível.");
    });
  });
}

// Configuração dos Gráficos
function configurarGraficos() {
  new Chart(document.getElementById("eventos-por-mes").getContext("2d"), {
    type: "bar",
    data: {
      labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
      datasets: [
        {
          label: "Eventos",
          data: [3, 5, 4, 8, 4, 0],
          backgroundColor: "#3498db",
          borderColor: "#2980b9",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true, ticks: { precision: 0 } },
      },
    },
  });

  new Chart(document.getElementById("categorias-chart").getContext("2d"), {
    type: "doughnut",
    data: {
      labels: ["Corporativo", "Cultural", "Educacional"],
      datasets: [
        {
          data: [8, 10, 6],
          backgroundColor: ["#20c997", "#4c6ef5", "#ff9800"],
          hoverOffset: 4,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "bottom" },
      },
    },
  });
}

function editarEventos(evento) {
  const modalOverlay = document.getElementById("modal-overlay");
  const btnCriar = document.getElementById("btn-criar");
  const btnEditar = document.getElementById("btn-editar");
  btnCriar.style.display = "none";
  btnEditar.style.display = "block";

  modalOverlay.classList.add("active");
  console.log(evento);
  document.getElementById("nome-evento").value = evento.nome;
  document.getElementById("modal-title").innerText = "Editar Evento";
  document.getElementById("categoria-evento").value = evento.categoria;
  document.getElementById("data-evento").value = evento.data;
  document.getElementById("btn-criar").innerText = "Atualizar Evento";

  btnEditar.onclick = () =>
    finalizarEdição({
      id: evento.id,
      nome: document.getElementById("nome-evento").value,
      categoria: document.getElementById("categoria-evento").value,
      data: document.getElementById("data-evento").value,
      status: evento.status, // Preserva o status original
    });
}

async function finalizarEdição(evento) {
  try {
    const response = await fetch(`http://127.0.0.1:5000/eventos/${evento.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ evento }),
    });
    if (response.ok) {
      console.log("Evento editado com sucesso");
      await carregarEventos(); // Só chama após UPDATE bem-sucedido
      fecharModal();
    } else {
      console.error("Erro ao editar evento:", response.statusText);
    }
  } catch (error) {
    console.error("Erro:", error);
  }
}
// Inicialização geral
document.addEventListener("DOMContentLoaded", function () {
  configurarMenu();
  configurarGraficos();
  configurarModalNovoEvento();
  carregarEventos();
});
