import { useState } from "react";

export default function TogglForm() {
  const [loading, setLoading] = useState("Submit");

  function handleSubmit(e: any) {
    console.log("submit");
    e.preventDefault();
    setLoading("Loading...");
    const form = e.target;
    const formData = new FormData(form);
    const fetchData = async () => {
      const response = await fetch(
        "https://58axq7c4ih.execute-api.ap-southeast-2.amazonaws.com/dev",
        {
          method: form.method,
          body: JSON.stringify({ firstName: "Joe", lastName: "Bloggs", formData }),
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
      console.log(data);
      setLoading("Success");
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
            onInvalid={(e) => e.target.setCustomValidity("Please enter a valid email")}
            onInput={(e) => e.target.setCustomValidity("")}
            className="border border-solid border-black mx-1 p-1"
          ></input>
        </label>
        <label>
          API key
          <input
            type="text"
            name="apiKey"
            defaultValue="b6228161ce875647f9a9c5ce8f23781f"
            onInvalid={(e) =>
              e.target.setCustomValidity("Please enter your Toggl API key")
            }
            onInput={(e) => e.target.setCustomValidity("")}
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
              e.target.setCustomValidity("Please enter your desired date")
            }
            onInput={(e) => e.target.setCustomValidity("")}
            className="border border-solid border-black mx-1"
          ></input>
        </label>
        <button type="submit" className="border border-solid border-black">
          {loading}
        </button>
      </form>
    </div>
  );
}
