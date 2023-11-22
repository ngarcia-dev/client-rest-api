import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useTickets } from "../context/TicketsContext";
import { useEffect } from "react";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

function TicketFormPage() {
  const { register, handleSubmit, setValue } = useForm();
  const { createTicket, getTicket, updateTicket } = useTickets();
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    const loadTicket = async () => {
      if (params.id) {
        const ticket = await getTicket(params.id);
        console.log(ticket);
        setValue("title", ticket.title);
        setValue("description", ticket.description);
        setValue("date", dayjs.utc(ticket.date).format("YYYY-MM-DD"));
      }
    };

    loadTicket();
  }, []);

  const onSubmit = handleSubmit((data) => {
    const dateValid = {
      ...data,
      date: data.date ? dayjs.utc(data.date).format() : dayjs.utc().format(),
    };

    if (params.id) {
      updateTicket(params.id, dateValid);
    } else {
      createTicket(dateValid);
    }

    navigate("/tickets");
  });

  return (
    <div className="flex h-[calc(100vh-100px)] items-center justify-center">
      <div className="bg-zinc-800 max-w-md w-full p-10 rounded-md">
        <form onSubmit={onSubmit}>
          <label htmlFor="title">Title</label>
          <input
            required
            type="text"
            placeholder="Title"
            {...register("title")}
            className="w-full bg-zinc-700 text-white px-4 py-4 rounded-md my-2"
            autoFocus
          />
          <label htmlFor="description">Description</label>
          <textarea
            rows="3"
            placeholder="Description"
            {...register("description")}
            className="w-full bg-zinc-700 text-white px-4 py-4 rounded-md my-2"
          />
          <label htmlFor="date">Date</label>
          <input
            required
            type="date"
            {...register("date")}
            className="w-full bg-zinc-700 text-white px-4 py-4 rounded-md my-2"
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
}

export default TicketFormPage;