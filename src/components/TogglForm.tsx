import { useState, useEffect, useRef } from "react";
interface DataRow {
  Date: string;
  Branch: string;
  "Charge Type": string;
  "Project No": string;
  "Job No": string;
  Description: string;
  Hours: string;
}

interface TogglResponse {
  data: { Data: DataRow[] };
}

const TogglReply = ({ data }: TogglResponse) => {
  const [rows, setRows] = useState<JSX.Element[]>();
  const [copied, setCopied] = useState<string>("");
  useEffect(() => {
    setCopied("");
  }, [data]);
  const tableRef = useRef(null);
  useEffect(() => {
    const newRows = data?.Data?.map((row: any, i: number) => {
      return (
        <tr key={"row-" + i}>
          <td key="date" className="border border-solid border-black p-1">
            {row.Date}
          </td>
          <td key="branch" className="border border-solid border-black p-1">
            {row.Branch}
          </td>
          <td key="charge" className="border border-solid border-black p-1">
            {row["Charge Type"]}
          </td>
          <td key="project" className="border border-solid border-black p-1">
            {row["Project No"]}
          </td>
          <td key="job" className="border border-solid border-black p-1">
            {row["Job No"]}
          </td>
          <td key="description" className="border border-solid border-black p-1">
            {row.Description}
          </td>
          <td key="hours" className="border border-solid border-black p-1">
            {row.Hours}
          </td>
        </tr>
      );
    });
    setRows(newRows);
  }, [data]);

  function handleCopy() {
    const range = document.createRange();
    range.selectNode(tableRef.current as unknown as Node);
    window.getSelection()?.removeAllRanges();
    window.getSelection()?.addRange(range);
    document.execCommand("copy");
    window.getSelection()?.removeAllRanges();
    setCopied("copied");
  }

  return (
    <div className="flex mt-4">
      <div className="w-fit mx-auto flex flex-col">
        <table ref={tableRef} className="border border-solid border-black">
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
        <button
          onClick={handleCopy}
          className="border border-solid border-black w-fit ml-auto inline-block justify-end mt-2 p-2 rounded hover:bg-black hover:text-white transition"
        >
          Copy Table Rows
        </button>
        <p className="ml-auto text-gray-600 text-sm mr-2">{copied}</p>
      </div>
    </div>
  );
};

export default function TogglForm() {
  const [loading, setLoading] = useState("Submit");
  const [data, setData] = useState<TogglResponse>();
  const [showApiKey, setShowApiKey] = useState<boolean>(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading("Loading...");
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const togglapikey = formData.get("togglapikey");
    const email = formData.get("email");
    const date = formData.get("date");
    const raw = JSON.stringify({ togglapikey, email, date });
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

  function toggleShowApiKey() {
    setShowApiKey(!showApiKey);
  }

  return (
    <div className="flex flex-col mt-4">
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
            autoComplete="email"
            onInvalid={(e) =>
              (e.target as HTMLInputElement).setCustomValidity(
                "Please enter a valid email"
              )
            }
            onInput={(e) => (e.target as HTMLInputElement).setCustomValidity("")}
            className="border border-solid border-black mx-1 p-1"
          ></input>
        </label>
        <div className="flex flex-col">
          <label>
            API key
            <input
              type={showApiKey ? "text" : "password"}
              name="togglapikey"
              autoComplete="password"
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
          <button
            type="button"
            onClick={toggleShowApiKey}
            className="w-fit h-fit border border-solid border-gray-600 rounded ml-auto p-0.5 text-sm px-1 mt-1 mr-1 hover:bg-black hover:text-white transition"
          >
            Show API Key
          </button>
        </div>
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
        <button
          type="submit"
          className="border border-solid border-black rounded hover:bg-black hover:text-white transition"
        >
          {loading}
        </button>
      </form>
      {/*@ts-ignore*/}
      {data && <TogglReply data={data} />}
    </div>
  );
}
