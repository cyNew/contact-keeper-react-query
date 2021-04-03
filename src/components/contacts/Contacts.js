import axios from "axios";
import { useQuery } from "react-query";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { useFilter } from "../../context/ContactState";
import Spinner from "../layout/Spinner";
import ContactItem from "./ContactItem";

const getAllContacts = async () => {
  try {
    const res = await axios.get("/api/contacts");
    return res.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export default function Contacts() {
  const { filter } = useFilter();

  const { data, isLoading } = useQuery("contacts", getAllContacts);

  if (isLoading) {
    return <Spinner />;
  }

  if (data && data.length === 0 && !isLoading) {
    return <h4>Please add contacts</h4>;
  }

  const contacts = data.filter((contact) => {
    if (!filter) {
      return true;
    } else {
      const regExp = new RegExp(filter, "gi");
      return (
        contact.name.match(regExp) ||
        contact.email.match(regExp) ||
        contact.phone.match(regExp)
      );
    }
  });

  return (
    <TransitionGroup>
      {contacts.map((contact) => (
        <CSSTransition key={contact._id} timeout={500} classNames="item">
          <ContactItem key={contact._id} contact={contact} />
        </CSSTransition>
      ))}
    </TransitionGroup>
  );
}
