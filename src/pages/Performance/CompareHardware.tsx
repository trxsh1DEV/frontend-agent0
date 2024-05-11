import "./style.css";

export default function CompareHardware() {
  return (
    <main className="container">
      <h2>Análise de Depreciação</h2>
      <section className="centralizado">
        <form>
          <h3>Hardware PC-8152</h3>
          <div className="Wrapper">
            <label htmlFor="input1">CPU:</label>
            <input type="text" id="input1" defaultValue="i5-9400F" />
          </div>
          <div className="Wrapper">
            <label htmlFor="input2">RAM:</label>
            <input type="text" id="input2" defaultValue="16GB DDR3" />
          </div>
          <div className="Wrapper">
            <label htmlFor="input3">Disco:</label>
            <input type="text" id="input3" defaultValue="SSD 240GB" />
          </div>
          <div className="Wrapper">
            <label htmlFor="input4">GPU:</label>
            <input type="text" id="input4" defaultValue="RX 550" />
          </div>
          <div className="Wrapper">
            <label htmlFor="input5">SO:</label>
            <input type="text" id="input5" defaultValue="Windows 11 Pro" />
          </div>
          <div className="Wrapper">
            <label htmlFor="input6">T. Depreciação:</label>
            <input type="text" id="input6" defaultValue="36" />
          </div>
          <div className="Wrapper">
            <label htmlFor="input7">Lançamento Hardw. :</label>
            <input type="text" id="input7" defaultValue="2019" />
          </div>
        </form>
        <form>
          <h3>Hardware Base</h3>
          <div className="Wrapper">
            <label htmlFor="input8">CPU:</label>
            <input readOnly type="text" id="input8" defaultValue="i7-8700" />
          </div>
          <div className="Wrapper">
            <label htmlFor="input9">RAM:</label>
            <input readOnly type="text" id="input9" defaultValue="8GB DDR3" />
          </div>
          <div className="Wrapper">
            <label htmlFor="input10">Disco:</label>
            <input readOnly type="text" id="input10" defaultValue="HD 200GB" />
          </div>
          <div className="Wrapper">
            <label htmlFor="input11">GPU:</label>
            <input
              readOnly
              type="text"
              id="input11"
              defaultValue="R7 360 / GTX 750"
            />
          </div>
          <div className="Wrapper">
            <label htmlFor="input12">SO:</label>
            <input
              readOnly
              type="text"
              id="input12"
              defaultValue="Windows 10 Home"
            />
          </div>
          <div className="Wrapper">
            <label htmlFor="input13">T. Depreciação:</label>
            <input readOnly type="text" id="input13" defaultValue="48" />
          </div>
          <div className="Wrapper">
            <label htmlFor="input14">Lançamento Hardw. :</label>
            <input readOnly type="text" id="input14" defaultValue="2017" />
          </div>
        </form>
      </section>
      <button style={{ marginTop: "30px", borderColor: "#646cff" }}>
        Calcular Depreciação
      </button>
    </main>
  );
}
