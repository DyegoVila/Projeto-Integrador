// Configuração do menu de navegação
document.addEventListener("DOMContentLoaded", function () {
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
  //Já faz a decodificação do base64 vindo do banco, que está no session storage
  const cargo = atob(localStorage.getItem("cargo").replace(/"/g, ""));

  if (!usuario) {
    // Usuário não está logado, redireciona para login
    //   window.location.href = "login.html";
  } else {
    // Usuário está logado, pode mostrar os dados
    profileName.textContent = usuario.replace(/"/g, "");
    profileRole.textContent = cargo;
  }

  logout.addEventListener("click", function (event) {
    localStorage.clear();
    // aqui você pode chamar uma função, redirecionar, limpar sessão, etc.
  });

  // Toggle menu no desktop
  if (navToggle) {
    navToggle.addEventListener("click", function () {
      sidenav.classList.toggle("expanded");
    });
  }

  // Toggle menu no mobile
  if (mobileNavToggle) {
    mobileNavToggle.addEventListener("click", function () {
      sidenav.classList.toggle("expanded");
    });
  }

  // Toggle perfil dropdown
  if (userProfile) {
    userProfile.addEventListener("click", function (e) {
      profileDropdown.classList.toggle("show");
      profileToggle.style.transform = profileDropdown.classList.contains("show")
        ? "rotate(180deg)"
        : "rotate(0)";
      e.stopPropagation();
    });

    // Fecha o dropdown ao clicar fora dele
    document.addEventListener("click", function () {
      profileDropdown.classList.remove("show");
      profileToggle.style.transform = "rotate(0)";
    });
  }

  // Links do menu
  const menuLinks = document.querySelectorAll(".menu-link:not(.disabled)");
  menuLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      // Remove a classe 'active' de todos os links
      menuLinks.forEach((item) => {
        item.classList.remove("active");
      });

      // Adiciona a classe 'active' ao link clicado
      this.classList.add("active");

      // Em dispositivos móveis, fecha o menu após clicar
      if (window.innerWidth <= 576) {
        sidenav.classList.remove("expanded");
      }

      // Não previne o comportamento padrão para permitir navegação real
      if (this.getAttribute("href") === "#") {
        e.preventDefault();
      }
    });
  });

  // Exibe aviso ao tentar clicar em itens desabilitados
  document.querySelectorAll(".menu-link.disabled").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      alert("Esta funcionalidade ainda não está disponível.");
    });
  });

  //   {
  //     nome: "Conferência Anual",
  //     categoria: "corporativo",
  //     data: "02/05/2025",
  //     status: "pendente",
  //   },
  //   {
  //     nome: "Workshop de Inovação",
  //     categoria: "educacional",
  //     data: "25/04/2025",
  //     status: "realizado",
  //   },
  //   {
  //     nome: "Exposição Cultural",
  //     categoria: "cultural",
  //     data: "18/04/2025",
  //     status: "realizado",
  //   },
  //   {
  //     nome: "Seminário Tecnológico",
  //     categoria: "educacional",
  //     data: "10/04/2025",
  //     status: "realizado",
  //   },
  //   {
  //     nome: "Festival de Música",
  //     categoria: "cultural",
  //     data: "05/04/2025",
  //     status: "cancelado",
  //   },
  // ];
  carregarEventos();
});

async function carregarEventos() {
  const eventosBody = document.getElementById("eventosBody");
  eventosBody.innerHTML = ""; // limpa o conteúdo antes de adicionar novos

  try {
    const response = await fetch("http://127.0.0.1:5000/eventos", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

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
  <td>
    <button class="btn-editar" data-id="${evento.id}">📝 Editar</button>
    <button class="btn btn-secondary" data-id="${
      evento.id
    }"> 🗑️ Excluir</button>
  </td>
`;

      eventosBody.appendChild(tr);
    });
  } catch (error) {
    console.error("Erro ao carregar eventos:", error);
  }
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Função para capitalizar a primeira letra

// Configuração e dados dos gráficos
document.addEventListener("DOMContentLoaded", function () {
  // Gráfico de eventos por mês
  const eventosPorMes = document
    .getElementById("eventos-por-mes")
    .getContext("2d");
  const eventosPorMesChart = new Chart(eventosPorMes, {
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
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0,
          },
        },
      },
    },
  });

  // Gráfico de distribuição por categoria
  const categoriasChart = document
    .getElementById("categorias-chart")
    .getContext("2d");
  const categoriasDonutChart = new Chart(categoriasChart, {
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
        legend: {
          position: "bottom",
        },
      },
    },
  });

  // Modal de novo evento
  const btnNovoEvento = document.getElementById("btn-novo-evento");
  const modalOverlay = document.getElementById("modal-overlay");
  const modalClose = document.querySelector(".modal-close");
  const btnCancelar = document.getElementById("btn-cancelar");
  const btnCriar = document.getElementById("btn-criar");
  const formNovoEvento = document.getElementById("form-novo-evento");

  // Abrir modal
  btnNovoEvento.addEventListener("click", () => {
    modalOverlay.classList.add("active");
  });

  // Fechar modal
  function fecharModal() {
    modalOverlay.classList.remove("active");
    formNovoEvento.reset();
  }

  modalClose.addEventListener("click", fecharModal);
  btnCancelar.addEventListener("click", fecharModal);

  // Clicar fora do modal para fechar
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) {
      fecharModal();
    }
  });

  // Criar novo evento
  btnCriar.addEventListener("click", () => {
    const nomeEvento = document.getElementById("nome-evento").value;
    const categoriaEvento = document.getElementById("categoria-evento").value;
    const dataEvento = document.getElementById("data-evento").value;

    if (nomeEvento && categoriaEvento && dataEvento) {
      // Em uma aplicação real, aqui faria um POST para API
      alert(`Evento "${nomeEvento}" criado com sucesso!`);

      // Adicionar à tabela para demonstração visual
      const tabela = document.querySelector(".eventos-table tbody");
      const novaLinha = document.createElement("tr");

      const dataFormatada = new Date(dataEvento).toLocaleDateString("pt-BR");

      novaLinha.innerHTML = `
                        <td>${nomeEvento}</td>
                        <td><span class="categoria ${categoriaEvento}">${
        categoriaEvento.charAt(0).toUpperCase() + categoriaEvento.slice(1)
      }</span></td>
                        <td>${dataFormatada}</td>
                        <td><span class="status pendente">Pendente</span></td>
                    `;

      tabela.insertBefore(novaLinha, tabela.firstChild);

      // Atualizar contador de eventos pendentes
      const eventosPendentes =
        document.querySelectorAll(".status.pendente").length;
      const cardEventosPendentes = document.querySelectorAll(".card-value")[2];
      cardEventosPendentes.textContent = eventosPendentes;

      fecharModal();
    } else {
      alert("Por favor, preencha todos os campos.");
    }
  });
});

// Configuração do usuário logado
