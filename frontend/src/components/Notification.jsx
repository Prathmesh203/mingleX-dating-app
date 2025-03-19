import React, { useState } from "react";
import { useEffect } from "react";
import { getRequests, respondRequest } from "../services/connectionServices";
import UseUserContext from "../hooks/UseUserContext";

function Notification() {
  const { requests, setRequests } = UseUserContext();
  const [loading, setLoading ] = useState(false);
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    const fetchData = async () => {
      try {
        const data = await getRequests();
        if (isMounted) {
          setRequests(data.data);
        }
        setLoading(false);
      } catch (error) {
        if (isMounted) {
          console.error("Error fetching data:", error);
        }
      }finally{
        setLoading(false)
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [setRequests]);

  const acceptRequest = async (requestId) => {
    try {
      await respondRequest("accepted", requestId);

      setRequests((prev) =>
        prev.filter((request) => request._id !== requestId)
      );
    } catch (error) {
      console.log(error);
    }
  };

  const rejectRequest = async (requestId) => {
    try {
      await respondRequest("rejected", requestId);

      setRequests((prev) =>
        prev.filter((request) => request._id !== requestId)
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
     { loading ?(<span className="loading loading-ball loading-xl"></span>
):<ul className="list bg-base-100 rounded-box shadow-md">
        <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">
          {requests && requests.length > 0
            ? "Your Requests Are"
            : "You don't have any new Request"}
        </li>

        {requests &&
          requests.map((request) => (
            <li className="list-row" key={request._id}>
              <div>
                <img
                  className="size-10 rounded-box"
                  src={request.fromUserId.profile}
                  alt="Profile"
                />
              </div>
              <div>
                <div>
                  {request.fromUserId.firstname +
                    " " +
                    request.fromUserId.lastname}
                </div>
                <div className="text-xs uppercase font-semibold opacity-60">
                  Interested in you
                </div>
              </div>
              <button
                onClick={() => acceptRequest(request._id)}
                className="btn btn-square w-[100%] hover:bg-green-300 btn-ghost"
              >
                Accept
              </button>
              <button
                onClick={() => rejectRequest(request._id)}
                className="btn btn-square hover:bg-red-300 btn-ghost"
              >
                Reject
              </button>
            </li>
          ))}
      </ul>}
    </div>
  );
}

export default Notification;
