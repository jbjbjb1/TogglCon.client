import { useState } from "react";

export default function TogglForm() {
  const [loading, setLoading] = useState("Submit");

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
    </div>
  );
}
