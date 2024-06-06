import { useState } from "preact/hooks";
import { request } from "../../utils/request";
import "./style.css";
import CustomInput from "../../components/InputCommom";

export default function CompareHardware() {
  const [icons, setIcons] = useState<any>({});
  // const [query, setQuery] = useState<string>("");

  // const handleInputChange = (e: any) => {
  //   setQuery(e?.target?.value);
  // };

  const calculate = async () => {
    const cpuElements = document.querySelectorAll(".cpu");
    const gpuElements: NodeListOf<HTMLInputElement> =
      document.querySelectorAll(".gpu");
    const cpuValues: string[] = [];
    const gpuValues: string[] = [];

    cpuElements.forEach((cpuElement: any, index: number) => {
      cpuValues.push(cpuElement.value);
      gpuValues.push(gpuElements[index].value);
    });

    if (cpuValues.length > 0) {
      try {
        const promiseCpu = request.post("/hardware/cpu/compare", cpuValues);
        const promiseGpu = request.post("/hardware/gpu/compare", gpuValues);

        const [resCpu, resGpu] = await Promise.all([promiseCpu, promiseGpu]);

        if (resCpu.data && resGpu.data) {
          const newIcons: any = {};
          console.log(resCpu.data, resGpu.data);

          newIcons.cpu =
            resCpu.data[0].score >= resCpu.data[1].score ? "icon-ok" : "icon-x";
          newIcons.gpu =
            resGpu.data[0].score >= resGpu.data[1].score ? "icon-ok" : "icon-x";

          ["ram", "disk", "so", "depreciation", "release"].forEach(
            (type, _) => {
              const elements = document.querySelectorAll(`.${type}`);
              const values = Array.from(elements).map((element: any) =>
                Number(element.value.match(/\d+/))
              );
              newIcons[type] = values[0] >= values[1] ? "icon-ok" : "icon-x";
            }
          );

          setIcons(newIcons);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };
  return (
    <main className="container">
      <h2>Análise de Depreciação</h2>
      <section className="centralizado">
        <form>
          <h3>Hardware PC-8152</h3>
          <div className="Wrapper">
            <CustomInput
              typeData="cpuData"
              placeholder="i5-9400F"
              label="CPU"
              defaultValue="i5-9400"
            />
          </div>
          <div className="Wrapper">
            <label htmlFor="input2">RAM:</label>
            <input
              type="text"
              id="input2"
              defaultValue="16GB DDR3"
              className="ram"
            />
          </div>
          <div className="Wrapper">
            <label htmlFor="input3">Disco:</label>
            <input
              type="text"
              id="input3"
              defaultValue="SSD 240GB"
              className="disk"
            />
          </div>
          <div className="Wrapper">
            <CustomInput
              typeData="test"
              placeholder="GeForce GTX 1060"
              label="GPU"
              defaultValue="GeForce GTX 1060"
            />
          </div>
          <div className="Wrapper">
            <label htmlFor="input5">SO:</label>
            <input
              type="text"
              id="input5"
              defaultValue="Windows 11 Pro"
              className="so"
            />
          </div>
          <div className="Wrapper">
            <label htmlFor="input6">T. Depreciação:</label>
            <input
              type="text"
              id="input6"
              defaultValue="36"
              className="depreciation"
            />
          </div>
          <div className="Wrapper">
            <label htmlFor="input7">Lançamento</label>
            <input
              type="text"
              id="input7"
              defaultValue="2019"
              className="release"
            />
          </div>
        </form>
        <form>
          <h3>Hardware Base</h3>
          <div className="Wrapper">
            <label htmlFor="cpu-base">CPU:</label>
            <input
              readOnly
              type="text"
              id="cpu-base"
              className="cpu"
              defaultValue="i7-8700K"
            />
            <span className={`icon ${icons.cpu || ""}`} />
          </div>
          <div className="Wrapper">
            <label htmlFor="input9">RAM:</label>
            <input
              readOnly
              type="text"
              id="input9"
              defaultValue="8GB DDR3"
              className="ram"
            />
            <span className={`icon ${icons.ram || ""}`} />
          </div>
          <div className="Wrapper">
            <label htmlFor="input10">Disco:</label>
            <input
              readOnly
              type="text"
              id="input10"
              defaultValue="HD 200GB"
              className="disk"
            />
            <span className={`icon ${icons.disk || ""}`} />
          </div>
          <div className="Wrapper">
            <label htmlFor="gpu-base">GPU:</label>
            <input
              readOnly
              type="text"
              id="gpu-base"
              className="gpu"
              defaultValue="GTX 750"
            />
            <span className={`icon ${icons.gpu || ""}`} />
          </div>
          <div className="Wrapper">
            <label htmlFor="input12">SO:</label>
            <input
              readOnly
              className="so"
              type="text"
              id="input12"
              defaultValue="Windows 10 Home"
            />
            <span className={`icon ${icons.so || ""}`} />
          </div>
          <div className="Wrapper">
            <label htmlFor="input13">T. Depreciação:</label>
            <input
              readOnly
              type="text"
              id="input13"
              defaultValue="48"
              className="depreciation"
            />
            <span className={`icon ${icons.depreciation || ""}`} />
          </div>
          <div className="Wrapper">
            <label htmlFor="input14">Lançamento</label>
            <input
              readOnly
              type="text"
              id="input14"
              defaultValue="2017"
              className="release"
            />
            <span className={`icon ${icons.release || ""}`} />
          </div>
        </form>
      </section>
      <button
        onClick={calculate}
        style={{ marginTop: "30px", borderColor: "#646cff" }}
      >
        Calcular Depreciação
      </button>
    </main>
  );
}
