import { useDispatch, useSelector } from "react-redux";
import { toggleModal } from "../../redux/modalSlice";
// import Peripherical from "./TablePeriphericals";
import FormPeripherical from "./FormPeripherical";
import {
  FormPropsPeripherical,
  schemaPeripherical,
} from "../../utils/Schemas/PeriphericalSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import "./clients.css";
import Modal from "../../components/Modal/Modal";
import { useEffect } from "preact/hooks";
import { queryClient } from "../../queryClient";
import { useMutation } from "@tanstack/react-query";
import { createPeripherical } from "../../hooks/usePeriphericals";

export default function TablePeriphericals() {
  const dispatch = useDispatch();
  const showModal = useSelector((state: any) => state.modal.showModal);

  const handleCreateNewClick = () => {
    dispatch(toggleModal()); // Define o estado showModal como true para exibir o modal
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormPropsPeripherical>({
    mode: "onBlur",
    resolver: zodResolver(schemaPeripherical),
  });

  const mutation = useMutation({
    mutationFn: createPeripherical,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["table-data"] });
    },
  });

  const handleForm = async (data: any) => {
    // console.log(data);
    // queryClient.setQueriesData({ queryKey: ["table-data"] }, data)
    // const state = queryClient.getQueriesData({ queryKey: ["table-data"] });
    // console.log(state)
    try {
      mutation.mutate(data);
      reset();
      handleCreateNewClick();
    } catch (err: any) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    console.log("rendering");
  }, [showModal]);
  return (
    <>
      <button style={{ marginTop: "30px" }} onClick={handleCreateNewClick}>
        Adicionar novo
      </button>
      {showModal && (
        <Modal onClose={handleCreateNewClick} isOpen={showModal}>
          <FormPeripherical
            errors={errors}
            handleForm={handleForm}
            handleSubmit={handleSubmit}
            register={register}
          />
        </Modal>
      )}
    </>
  );
}
