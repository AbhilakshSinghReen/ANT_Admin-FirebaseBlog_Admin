import PropagateLoader from "react-spinners/PropagateLoader";

export default function PrimaryLoader({ loading }) {
  return <PropagateLoader loading={loading} size={15} color="#3f51b5" />;
}
