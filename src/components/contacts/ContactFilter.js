import { useRef } from "react";
import { useFilter } from "../../context/ContactState";

export default function ContactFilter() {
  const { setFilter } = useFilter();
  const textRef = useRef("");

  const onChange = () => {
    setFilter(textRef.current.value);
  };

  return (
    <form>
      <input
        ref={textRef}
        type="text"
        placeholder="Filter Contacts..."
        onChange={onChange}
      />
    </form>
  );
}
