import { Input } from "../../components/Input/Input";

export default function FormPeripherical({
  register,
  handleSubmit,
  handleForm,
  errors,
}: any) {
  return (
    <>
      <div className="MainContainer">
        <form className="FormContainer" onSubmit={handleSubmit(handleForm)}>
          <h2>Adicionar novo dispositivo</h2>
          <div className="Container">
            <Input
              {...register("host")}
              label="Host"
              helperText={errors.host?.message}
            />

            <Input
              {...register("status")}
              label="Status"
              helperText={errors.status?.message}
            />
          </div>

          <div className="Container">
            <Input
              {...register("class")}
              label="Classe"
              helperText={errors.class?.message}
            />

            <div className="InputContent">
              <label className="Label" htmlFor="department">
                Departamento
              </label>
              <select
                {...register("department")}
                className="InputStyle"
                id="department"
                name="department"
              >
                <option value="TI">TI</option>
                <option value="Administração">Administração</option>
              </select>
              <p style={{ borderColor: "red" }}>{errors.category?.message}</p>
            </div>
          </div>

          <div className="Container">
            <Input
              {...register("person")}
              label="Responsável"
              helperText={errors.person?.message}
            />

            <Input
              {...register("manufacturer")}
              label="Fabricante"
              helperText={errors.manufacturer?.message}
            />
          </div>

          <div className="Container">
            <Input
              {...register("sample")}
              label="Modelo/Versão"
              helperText={errors.sample?.message}
            />

            <Input
              {...register("so")}
              label="SO"
              helperText={errors.so?.message}
            />
          </div>

          <div className="Container">
            <div className="InputContent">
              <label className="Label" htmlFor="category">
                Categoria
              </label>
              <select
                {...register("category")}
                className="InputStyle"
                id="category"
                name="category"
                multiple
              >
                <option value="Informática">Informática</option>
                <option value="Periféricos">Periféricos</option>
              </select>
              <p style={{ borderColor: "red" }}>{errors.category?.message}</p>
            </div>

            <Input
              {...register("patrimony")}
              label="Patrimônio"
              helperText={errors.patrimony?.message}
            />
          </div>

          <div className="Container">
            <Input
              {...register("date_warranty")}
              label="Data Garantia"
              type="date"
              helperText={errors.date_warranty?.message}
            />

            <Input
              {...register("local")}
              label="Local"
              helperText={errors.local?.message}
            />
          </div>

          <div className="Container">
            <Input
              {...register(`nfe`)}
              label="NF-e"
              helperText={errors.nfe?.message}
            />

            <Input
              {...register(`purchase_price`, {
                valueAsNumber: true,
              })}
              label="Preço de compra"
              helperText={errors.purchase_price?.message}
              type="number"
            />
          </div>

          {/* <div className="form-group">
              <label className="Label" htmlFor="message">Message:</label>
              <textar
              className="InputStyle" ea id="message" name="message" required></textarea>
            </div> */}

          <button type="submit">Submit</button>
        </form>
      </div>
    </>
  );
}
