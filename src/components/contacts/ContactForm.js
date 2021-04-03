import axios from "axios";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useCurrent } from "../../context/ContactState";

const initState = {
  name: "",
  email: "",
  phone: "",
  type: "personal",
};

const addContact = async (contact) => {
  try {
    const res = await axios.post(`/api/contacts/`, contact);
    return res.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

const updateContact = async (contact) => {
  try {
    const res = await axios.put(`/api/contacts/${contact._id}`, contact);
    return res.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export default function ContactForm() {
  const [contact, setContact] = useState(initState);

  const { current, clearCurrent } = useCurrent();
  const { name, email, phone, type } = contact;

  const queryClient = useQueryClient();

  const createMutation = useMutation(() => addContact(contact), {
    onSuccess: () => queryClient.invalidateQueries("contacts"),
  });

  const updateMutation = useMutation(() => updateContact(contact), {
    onSuccess: () => queryClient.invalidateQueries("contacts"),
  });

  const formTitle = current ? "Edit Contact" : "Add Contact";
  const submitTitle = current ? "Update Contact" : "Add Contact";

  useEffect(() => {
    if (!current) {
      setContact(initState);
    } else {
      setContact(current);
    }
  }, [current]);

  const onChange = (e) => {
    setContact((contact) => {
      const newContact = Object.assign({}, contact, {
        [e.target.name]: e.target.value,
      });

      return newContact;
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!current) {
      createMutation.mutate(contact);
    } else {
      updateMutation.mutate(contact);
    }

    clearAll();
  };

  const clearAll = () => {
    clearCurrent();
    setContact(initState);
  };

  return (
    <form onSubmit={onSubmit}>
      <h2 className="text-primary">{formTitle}</h2>
      <input
        type="text"
        placeholder="name"
        name="name"
        value={name}
        onChange={onChange}
      />
      <input
        type="text"
        placeholder="Email"
        name="email"
        value={email}
        onChange={onChange}
      />
      <input
        type="text"
        placeholder="Phone"
        name="phone"
        value={phone}
        onChange={onChange}
      />
      <h5>Contact Type</h5>
      <input
        type="radio"
        name="type"
        value="personal"
        checked={type === "personal"}
        onChange={onChange}
      />{" "}
      Personal{" "}
      <input
        type="radio"
        name="type"
        value="professional"
        checked={type === "professional"}
        onChange={onChange}
      />{" "}
      Professional{" "}
      <div>
        <input
          type="submit"
          value={submitTitle}
          className="btn btn-primary btn-block"
        />
      </div>
      {current && (
        <div>
          <button className="btn btn-light btn-block" onClick={clearAll}>
            Clear
          </button>
        </div>
      )}
    </form>
  );
}
