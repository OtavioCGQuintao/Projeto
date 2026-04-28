import React, { useState, useMemo } from "react";
import "./App.css";
import boloImg from "./assets/boloImg.jpg";
import carrinhoIcon from "./assets/carrinhoIcon.png";
import instagramIcon from "./assets/instagramIcon.png";
import whatsappIcon from "./assets/whatsappIcon.png";
import perfilIcon from "./assets/perfilIcon.jpg";

export default function App() {
  const [pagina, setPagina] = useState("home");
  const [carrinho, setCarrinho] = useState([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("Todas");
  const [shake, setShake] = useState(false);

  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);
  const [linkWhats, setLinkWhats] = useState("");
  const [textoPedido, setTextoPedido] = useState("");

  const [showTutorial, setShowTutorial] = useState(false);

  const [entrega, setEntrega] = useState(false);
  const [endereco, setEndereco] = useState({
    bairro: "",
    rua: "",
    numero: "",
    complemento: ""
  });

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
    const subtotal = carrinho.reduce(
      (acc, item) => acc + item.produto.preco * item.quantidade,
      0
    );

    return entrega ? subtotal + 0 : subtotal;
  }, [carrinho, entrega]);

  function fecharTutorial() {
    setShowTutorial(false);
  }

  function finalizarPedido() {
    if (entrega) {
      if (!endereco.bairro || !endereco.rua || !endereco.numero) {
        alert("Preencha bairro, rua e número para entrega.");
        return;
      }
    }

    const numero = "5531996210180";

    const mensagem = carrinho
      .map(item =>
        `- ${item.produto.nome} x${item.quantidade} (R$ ${item.produto.preco})`
      )
      .join("\n");

    const taxa = entrega ? "\nTaxa de entrega: R$ A combinar" : "";

    const enderecoTexto = entrega
      ? `\n\nEndereço:\n${endereco.rua}, ${endereco.numero}${endereco.complemento ? " - " + endereco.complemento : ""
      }\n${endereco.bairro}`
      : "";

    const textoFinal =
      `Olá! Vou querer:\n\n${mensagem}${taxa}${enderecoTexto}\n\nTotal: R$ ${total}`;

    const url = `https://wa.me/${numero}?text=${encodeURIComponent(textoFinal)}`;

    setTextoPedido(textoFinal);
    setLinkWhats(url);
    setMostrarConfirmacao(true);
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
          <div className="logo">
            <img className="logo-img" src={perfilIcon} alt="Perfil" />
            <span className="logo-text">Gostosuras da Helena</span>
          </div>
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
    <>
      {mostrarConfirmacao && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "20px",
              borderRadius: "15px",
              width: "90%",
              maxWidth: "400px",
              textAlign: "center",
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
            }}
          >
            <h3 style={{ marginBottom: "10px", color: "#e67e22" }}>
              Confirmar pedido
            </h3>

            <p style={{ fontSize: "14px", color: "#333" }}>
              Deseja enviar seu pedido para o WhatsApp?
            </p>

            <div
              style={{
                maxHeight: "150px",
                overflowY: "auto",
                textAlign: "left",
                fontSize: "12px",
                background: "#f7f7f7",
                padding: "10px",
                borderRadius: "10px",
                marginTop: "10px"
              }}
            >
              {textoPedido}
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
              <button
                style={{
                  background: "#e67e22",
                  color: "#fff",
                  flex: 1,
                  border: "none",
                  padding: "10px",
                  borderRadius: "8px"
                }}
                onClick={() => {
                  window.open(linkWhats, "_blank");
                  setMostrarConfirmacao(false);
                }}
              >
                Confirmar
              </button>

              <button
                style={{
                  background: "#ccc",
                  color: "#000",
                  flex: 1,
                  border: "none",
                  padding: "10px",
                  borderRadius: "8px"
                }}
                onClick={() => setMostrarConfirmacao(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

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

        <div style={{ marginTop: "15px" }}>
          <label>
            <input
              type="checkbox"
              checked={entrega}
              onChange={(e) => setEntrega(e.target.checked)}
            />
            {" "}Quero entrega (+ R$ Valor a combinar)
          </label>

          {entrega && (
            <div style={{ marginTop: "10px" }}>
              <input placeholder="Bairro"
                value={endereco.bairro}
                onChange={(e) => setEndereco({ ...endereco, bairro: e.target.value })} style={{
                  border: entrega && !endereco.bairro ? "1px solid red" : undefined
                }}
              />
              <input placeholder="Rua"
                value={endereco.rua}
                onChange={(e) => setEndereco({ ...endereco, rua: e.target.value })} style={{
                  border: entrega && !endereco.rua ? "1px solid red" : undefined
                }}
              />
              <input placeholder="Número"
                value={endereco.numero}
                onChange={(e) => setEndereco({ ...endereco, numero: e.target.value })} style={{
                  border: entrega && !endereco.numero ? "1px solid red" : undefined
                }}
              />
              <input placeholder="Complemento (opcional)"
                value={endereco.complemento}
                onChange={(e) => setEndereco({ ...endereco, complemento: e.target.value })}
              />
            </div>
          )}
        </div>

        <h2>Total: R$ {total}</h2>

        <button className="btnWhatsapp" onClick={finalizarPedido}>
          Finalizar pedido no WhatsApp
        </button>

        <button onClick={() => setPagina("home")}>
          Voltar
        </button>

        <footer className="footerSocial">
          <p className="contatoTexto">Contate-me</p>

          <a href="https://www.instagram.com/gostosura_da_helena/" target="_blank" rel="noreferrer">
            <img src={instagramIcon} alt="Instagram" />
          </a>

          <a href="https://wa.me/5531996210180" target="_blank" rel="noreferrer">
            <img src={whatsappIcon} alt="WhatsApp" />
          </a>
        </footer>
      </div>
    </>
  );
}