import React, { useState, useMemo } from "react";
import "./App.css";
import boloImg from "./assets/boloImg.jpg";
import carrinhoIcon from "./assets/carrinhoIcon.png";
import instagramIcon from "./assets/instagramIcon.png";
import whatsappIcon from "./assets/whatsappIcon.png";

export default function App() {
  const [pagina, setPagina] = useState("home");
  const [carrinho, setCarrinho] = useState([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("Todas");
  const [shake, setShake] = useState(false);

  const [showTutorial, setShowTutorial] = useState(false);

  React.useEffect(() => {
    setShowTutorial(true);
  }, []);

  const produtos = [
    { nome: "Bolo de Banana Integral", categoria: "Bolos", preco: 28, imagem: boloImg },
    { nome: "Bolo de Cenoura", categoria: "Bolos", preco: 30, imagem: boloImg },
    { nome: "Bolo de Chocolate", categoria: "Bolos", preco: 35, imagem: boloImg },
    { nome: "Bolo de Ninho", categoria: "Bolos", preco: 40, imagem: boloImg },
    { nome: "Broinha de Fubá com Canjica", categoria: "Quitandas", preco: 20, imagem: boloImg },
    { nome: "Caçarola", categoria: "Quitandas", preco: 25, imagem: boloImg },
    { nome: "Cookie", categoria: "Doces", preco: 8, imagem: boloImg },
    { nome: "Pão 100% Integral", categoria: "Pães", preco: 14, imagem: boloImg },
    { nome: "Pão de Canela", categoria: "Pães", preco: 12, imagem: boloImg },
    { nome: "Pudim de Pão", categoria: "Doces", preco: 20, imagem: boloImg },
    { nome: "Rosquinha de Farinha de Biju", categoria: "Rosquinhas", preco: 16, imagem: boloImg },
    { nome: "Rosquinha de Nata", categoria: "Rosquinhas", preco: 15, imagem: boloImg },
    { nome: "Rosquinha Integral", categoria: "Rosquinhas", preco: 18, imagem: boloImg },
    { nome: "Tareco de Queijo", categoria: "Quitandas", preco: 18, imagem: boloImg },
    { nome: "Torta de Frango (Grande)", categoria: "Tortas", preco: 55, imagem: boloImg },
    { nome: "Torta de Frango (Média)", categoria: "Tortas", preco: 40, imagem: boloImg },
    { nome: "Torta de Frango (Pequena)", categoria: "Tortas", preco: 30, imagem: boloImg }
  ];

  const categorias = useMemo(() => {
    return ["Todas", ...Array.from(new Set(produtos.map(p => p.categoria))).sort()];
  }, [produtos]);

  const produtosFiltrados = useMemo(() => {
    if (categoriaSelecionada === "Todas") return produtos;
    return produtos.filter(p => p.categoria === categoriaSelecionada);
  }, [categoriaSelecionada, produtos]);

  const [produtoConfirmado, setProdutoConfirmado] = useState(null);

  function triggerShake() {
    setShake(true);
    setTimeout(() => setShake(false), 300);
  }

  function adicionar(produto) {
    setCarrinho(prev => {
      const existe = prev.find(item => item.produto.nome === produto.nome);
      triggerShake();

      if (existe) {
        return prev.map(item =>
          item.produto.nome === produto.nome
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        );
      }

      return [...prev, { produto, quantidade: 1 }];
    });
  }

  function aumentar(produto) {
    setCarrinho(prev =>
      prev.map(item =>
        item.produto.nome === produto.nome
          ? { ...item, quantidade: item.quantidade + 1 }
          : item
      )
    );
  }

  function diminuir(produto) {
    setCarrinho(prev =>
      prev
        .map(item =>
          item.produto.nome === produto.nome
            ? { ...item, quantidade: item.quantidade - 1 }
            : item
        )
        .filter(item => item.quantidade > 0)
    );
  }

  function remover(produto) {
    setCarrinho(prev =>
      prev.filter(item => item.produto.nome !== produto.nome)
    );
  }

  const total = useMemo(() => {
    return carrinho.reduce(
      (acc, item) => acc + item.produto.preco * item.quantidade,
      0
    );
  }, [carrinho]);

  function fecharTutorial() {
    setShowTutorial(false);
  }

function finalizarPedido() {
  const modal = document.createElement("div");

  modal.style.position = "fixed";
  modal.style.inset = "0";
  modal.style.background = "rgba(0,0,0,0.75)";
  modal.style.display = "flex";
  modal.style.alignItems = "center";
  modal.style.justifyContent = "center";
  modal.style.zIndex = "9999";

  modal.innerHTML = `
    <div style="
      background: white;
      padding: 20px;
      border-radius: 12px;
      max-width: 320px;
      text-align: center;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
      font-family: Arial;
    ">
      <h3 style="margin: 0 0 10px 0;">Confirme sua compra</h3>
      <p style="margin: 0 0 15px 0;">
        Confira itens, quantidades e total antes de continuar.
      </p>

      <button id="confirmarBtn" style="
        background: #25D366;
        color: white;
        border: none;
        padding: 10px;
        width: 100%;
        border-radius: 8px;
        margin-bottom: 8px;
        cursor: pointer;
      ">Confirmar</button>

      <button id="cancelarBtn" style="
        background: #d43a3a;
        color: black;
        border: none;
        padding: 10px;
        width: 100%;
        border-radius: 8px;
        cursor: pointer;
      ">Cancelar</button>
    </div>
  `;

  document.body.appendChild(modal);

  document.getElementById("cancelarBtn").onclick = () => {
    document.body.removeChild(modal);
  };

  document.getElementById("confirmarBtn").onclick = () => {
    document.body.removeChild(modal);

    const numero = "5531996210180";

    const mensagem = carrinho
      .map(item =>
        `- ${item.produto.nome} x${item.quantidade} (R$ ${item.produto.preco})`
      )
      .join("\n");

    const textoFinal = `Olá! Vou querer:\n\n${mensagem}\n\nTotal: R$ ${total}`;

    const url = `https://wa.me/${numero}?text=${encodeURIComponent(textoFinal)}`;

    window.open(url, "_blank");
  };
}

  if (pagina === "home") {
    return (
      <div>

        {showTutorial && (
          <div
            onClick={fecharTutorial}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 999,
              background: "rgba(0,0,0,0.80)",
              backdropFilter: "blur(2px)"
            }}
          >
            {/* TEXTO (responsivo e centralizado no carrinho) */}
            <div
              style={{
                position: "fixed",
                bottom: "90px",
                right: "14px",
                color: "white",
                fontWeight: "bold",
                textAlign: "center",
                width: "150px",
                animation: "floatUp 1.2s infinite"
              }}
            >
              O seu carrinho está aqui
            </div>

            {/* DESTAQUE DO BOTÃO */}
            <div
              style={{
                position: "fixed",
                bottom: "18px",
                right: "18px",
                width: "58px",
                height: "58px",
                borderRadius: "50%",
                boxShadow: "0 0 0 10px rgba(255,255,255,0.18), 0 0 25px rgba(255,255,255,0.25)",
                pointerEvents: "none",
                animation: "pulse 1.5s infinite"
              }}
            />
          </div>
        )}

        <header className="topbar">
          <div className="logo">🍰 Gostosuras da Helena</div>
        </header>

        <nav className="categorias">
          {categorias.map(cat => (
            <button
              key={cat}
              className={cat === categoriaSelecionada ? "ativo" : ""}
              onClick={() => setCategoriaSelecionada(cat)}
            >
              {cat}
            </button>
          ))}
        </nav>

        <main className="container">
          <div className="grid">
            {produtosFiltrados.map((p, i) => (
              <div className="card hoverCard" key={i}>
                <img src={p.imagem} alt={p.nome} className="imagem" />
                <h3>{p.nome}</h3>
                <span className="preco">R$ {p.preco}</span>

                <button
                  className={produtoConfirmado === p.nome ? "btnAdicionado" : ""}
                  onClick={() => {
                    adicionar(p);
                    setProdutoConfirmado(p.nome);
                    setTimeout(() => setProdutoConfirmado(null), 1000);
                  }}
                >
                  {produtoConfirmado === p.nome ? "Adicionado" : "Adicionar ao carrinho"}
                </button>
              </div>
            ))}
          </div>
        </main>

        <button
          className={`floatCarrinho ${shake ? "shake" : ""}`}
          onClick={() => setPagina("carrinho")}
        >
          <img src={carrinhoIcon} alt="Carrinho" />
          <span>{carrinho.reduce((acc, item) => acc + item.quantidade, 0)}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="container carrinho">
      <h1>Carrinho</h1>

      {carrinho.length === 0 && <p>Seu carrinho está vazio</p>}

      {carrinho.map((item, i) => (
        <div className="itemCarrinho" key={i}>
          <button className="removerItem" onClick={() => remover(item.produto)}>
            ×
          </button>

          <img src={item.produto.imagem} alt={item.produto.nome} />

          <div className="infoCarrinho">
            <h3>{item.produto.nome}</h3>
            <p>R$ {item.produto.preco}</p>

            <div className="controleQtd">
              <button onClick={() => diminuir(item.produto)}>-</button>
              <span>{item.quantidade}</span>
              <button onClick={() => aumentar(item.produto)}>+</button>
            </div>
          </div>
        </div>
      ))}

      <h2>Total: R$ {total}</h2>

      <button className="btnWhatsapp" onClick={finalizarPedido}>
        Finalizar pedido no WhatsApp
      </button>

      <button onClick={() => setPagina("home")}>
        Voltar
      </button>

      <footer className="footerSocial">
        <a href="https://www.instagram.com/gostosura_da_helena/" target="_blank" rel="noreferrer">
          <img src={instagramIcon} alt="Instagram" />
        </a>

        <a href="https://wa.me/5531996210180" target="_blank" rel="noreferrer">
          <img src={whatsappIcon} alt="WhatsApp" />
        </a>
      </footer>
    </div>
  );
}