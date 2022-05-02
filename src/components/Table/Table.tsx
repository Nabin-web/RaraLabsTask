import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Table.css";
import { setConstantValue } from "typescript";

const user_query = `
{
users
{
    data
    {
    id
    name
    username
    email
    address{
        street
    }
    phone
    website
    }
}
}
`;

const Table = () => {
  const [data, setData] = useState<any[]>([]);
  const [checkId, setCheckIds] = useState<any[]>([]);
  const [bool, setBool] = useState(false);
  const [inputvalue, setValue] = useState<String>("");
  const [searchResult, setResult] = useState<any[]>([]);
  const [counter, setCounter] = useState<any>(0);

  useEffect(() => {
    fetch("https://graphqlzero.almansi.me/api", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: user_query }),
    })
      .then((response) => response.json())
      .then((data) => setData(data.data.users.data));
  }, []);

  useEffect(() => {
    const dataId = data.filter((each) => checkId.includes(each.id));
    if (dataId.length > 0 && dataId.length === data.length) {
      setBool(true);
    } else {
      setBool(false);
    }
  }, [checkId, data]);

  // const handleBtn = () => {
  //   // alert("jere");
  //   setCounter(counter++);
  // };

  const handleCheck =
    (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      if (name === "singleCheck") {
        if (e.target.checked) {
          setCheckIds([...checkId, e.target.id]);
        } else {
          setCheckIds(checkId.filter((each) => e.target.id !== each));
        }
      }
      if (name === "multipleCheck") {
        if (e.target.checked) {
          const id = data.map((each) => each.id);
          setCheckIds(checkId.concat(id));
        } else {
          setCheckIds([]);
        }
      }
    };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { value } = e.target;
    setValue(value);
  };

  useEffect(() => {
    if (data?.length) {
      const filter = data.filter((each) => {
        return each.name
          ?.toLowerCase()
          .trim()
          .startsWith(inputvalue?.toLowerCase().trim());
      });
      setResult([...filter]);
    }
  }, [inputvalue, JSON.stringify(data)]);
  let count = 0;

  return (
    <>
      <div className="container-fluid">
        <div className="flex-container">
          <div className="flex-child magenta userHead">Users</div>

          <div className="flex-child green search">
            <input
              type="text"
              id="user"
              name="name"
              onChange={handleChange}
              placeholder="Search username.."
            />
          </div>
        </div>

        <div className="row   bg-secondary text-white" id="heading">
          <div className="col-1 ">
            <input
              type="checkbox"
              onChange={handleCheck("multipleCheck")}
              checked={bool}
            />
          </div>

          <div className="col-2  ">Name</div>
          <div className="col-2  ">Username</div>
          <div className="col-2  ">Email</div>
          <div className="col-2  ">Phone</div>
          <div className="col-2  ">Website</div>
          <div className="col-1  ">Address</div>
        </div>

        {searchResult.map((each, index) => {
          return (
            <div className="row  userData" key={index}>
              <div className="col-1  ">
                <input
                  type="checkbox"
                  id={each.id}
                  checked={checkId.includes(each.id) || false}
                  onChange={handleCheck("singleCheck")}
                />
              </div>

              <div className="col-2  ">{each.name}</div>
              <div className="col-2  ">{each.username}</div>
              <div className="col-2  ">{each.email}</div>
              <div className="col-2  ">{each.phone}</div>
              <div className="col-2  ">{each.website}</div>
              <div className="col-1  ">{each.address.street}</div>
            </div>
          );
        })}
      </div>

      <div className="btnCount">
        <div>{counter}</div>
        <button onClick={() => setCounter(counter + 1)}>Click</button>
      </div>
    </>
  );
};

export default Table;
