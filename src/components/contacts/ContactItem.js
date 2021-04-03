import axios from "axios";
import PropTypes from "prop-types";
import { useMutation, useQueryClient } from "react-query";
import { useCurrent } from "../../context/ContactState";

const deleteContact = async (contactId) => {
  try {
    const res = await axios.delete(`/api/contacts/${contactId}`);
    return res.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export default function ContactItem({ contact }) {
  const { setCurrent, clearCurrent } = useCurrent();

  const { _id, name, email, phone, type } = contact;

  const queryClient = useQueryClient();
  const mutation = useMutation(() => deleteContact(_id), {
    onSuccess: () => queryClient.invalidateQueries('contacts')
  });

  const badgeStyle =
    type === "professional" ? "badge-success" : "badge-primary";
  const uppercaseType = `${type[0].toUpperCase() + type.slice(1)}`;

  const onDelete = () => {
    mutation.mutate();
    clearCurrent();
  };

  return (
    <div className="card bg-light">
      <h3 className="text-primary text-left">
        {name}{" "}
        <span style={{ float: "right" }} className={`badge ${badgeStyle}`}>
          {uppercaseType}
        </span>
      </h3>
      <ul className="list">
        {email && <ContactInfo icon="fas fa-envelope-open" info={email} />}
        {phone && <ContactInfo icon="fas fa-phone" info={phone} />}
      </ul>
      <p>
        <button
          className="btn btn-dark btn-sm"
          onClick={() => setCurrent(contact)}
        >
          Edit
        </button>
        <button className="btn btn-danger btn-sm" onClick={onDelete}>
          Delete
        </button>
      </p>
    </div>
  );
}

function ContactInfo({ icon, info }) {
  return (
    <li>
      <i className={`fas ${icon}`}></i> {info}
    </li>
  );
}

ContactItem.propTypes = {
  contact: PropTypes.object.isRequired,
};
