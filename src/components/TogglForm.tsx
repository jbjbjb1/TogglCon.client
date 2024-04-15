import { useState, useEffect } from "react";
interface TogglResponse {
  data: {
    Date: { [key: string]: string };
    Branch: { [key: string]: string };
    "Charge Type": { [key: string]: string };
    "Project No": { [key: string]: string };
    "Job No": { [key: string]: string };
    Description: { [key: string]: string };
    Hours: { [key: string]: string };
  };
}

const TogglReply = ({ data }: TogglResponse) => {
  const [rows, setRows] = useState<JSX.Element[]>();
  useEffect(() => {
    const dataEntries = Object.entries(data ?? []);
    const dataEntriesFormatted = dataEntries.map((entry) => {
      return Object.values(entry[1]);
    });
    const length = dataEntriesFormatted?.[0]?.length;
    function genRows() {
      let newRows = [];
      for (let i = 0; i < length; i++) {
        newRows.push(
          <tr key={"row-" + i}>
            {dataEntriesFormatted.map((column) => {
              return (
                <td
                  key={i + "-" + column[i]}
                  className="border border-solid border-black p-1"
                >
                  {column[i]}
                </td>
              );
            })}
          </tr>
        );
      }
      setRows(newRows);
    }
    genRows();
  }, [data]);
  return (
    <div className="flex mt-4">
      <table className="mx-auto border border-solid border-black">
        <tbody>
          <tr>
            {[
              "Date",
              "Branch",
              "Charge Type",
              "Project No.",
              "Job No.",
              "Description",
              "Hours",
            ].map((name) => {
              return (
                <td key={name} className="border border-solid border-black p-1">
                  {name}
                </td>
              );
            })}
          </tr>
          {rows}
        </tbody>
      </table>
    </div>
  );
};

export default function TogglForm() {
  const [loading, setLoading] = useState("Submit");
  const [data, setData] = useState<TogglResponse>();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    console.log("submit");
    e.preventDefault();
    setLoading("Loading...");
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const togglapikey = formData.get("togglapikey");
    const email = formData.get("email");
    const date = formData.get("date");
    const raw = JSON.stringify({ togglapikey, email, date });
    console.log(raw);
    const fetchData = async () => {
      const response = await fetch(
        "https://6worz4cmw2.execute-api.ap-southeast-2.amazonaws.com/dev",
        {
          method: form.method,
          body: raw,
          headers: { "Content-Type": "application/json" },
        }
      );
      if (response?.ok ?? false) {
        setLoading("Success");
      } else {
        setLoading("Error");
        console.error((response && response?.status) ?? "No response");
      }
      console.log(formData);
      const data = await response.json();
      setLoading("Success");
      console.log(data);
      setData(JSON.parse(data.body));
    };
    fetchData();
  }

  function handleChange() {
    if (loading == "Submit") {
      return;
    }
    setLoading("Submit");
  }

  return (
    <div className="flex flex-col">
      <form
        id="protoform"
        method="POST"
        onSubmit={handleSubmit}
        className="flex flex-col mx-auto border border-solid border-black space-y-4 p-2"
        onChange={handleChange}
      >
        {/*API Key, Email, Date*/}
        <label>
          Email
          <input
            type="email"
            name="email"
            required
            defaultValue="rohan.nelson@gmail.com"
            onInvalid={(e) =>
              (e.target as HTMLInputElement).setCustomValidity(
                "Please enter a valid email"
              )
            }
            onInput={(e) => (e.target as HTMLInputElement).setCustomValidity("")}
            className="border border-solid border-black mx-1 p-1"
          ></input>
        </label>
        <label>
          API key
          <input
            type="text"
            name="togglapikey"
            onInvalid={(e) =>
              (e.target as HTMLInputElement).setCustomValidity(
                "Please enter your Toggl API key"
              )
            }
            onInput={(e) => (e.target as HTMLInputElement).setCustomValidity("")}
            required
            className="border border-solid border-black mx-1 p-1"
          ></input>
        </label>
        <label>
          Date
          <input
            type="date"
            name="date"
            required
            onInvalid={(e) =>
              (e.target as HTMLInputElement).setCustomValidity(
                "Please enter your desired date"
              )
            }
            onInput={(e) => (e.target as HTMLInputElement).setCustomValidity("")}
            className="border border-solid border-black mx-1"
          ></input>
        </label>
        <button type="submit" className="border border-solid border-black">
          {loading}
        </button>
      </form>
      {/*@ts-ignore*/}
      {data?.Date && <TogglReply data={data} />}
    </div>
  );
}
