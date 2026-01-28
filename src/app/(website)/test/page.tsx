"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { formatDistanceToNow } from 'date-fns';

const Test = () => {
  // const users = useQuery(api.backend.personalInformation.get);
  // const createUser = useMutation(api.backend.personalInformation.create);
  return (
    <div className="min-h-screen">
      <div className="pt-50 max-w-7xl mx-auto">
        {/* {users?.map((user) => (
          <div className="border bg-secondary space-y-2 p-5" key={user._id}>
			<img src={user.imageUrl} width={100} height={100} className='rounded-full' />
            <p>{user.clerkId}</p>
			<p>{user.firstName} {user.lastName}</p>
            <p>{user.emailAddress}</p>
			<p>Created {formatDistanceToNow(user._creationTime, {addSuffix: true})}</p>
          </div>
        ))} */}
      </div>
    </div>
  );
};

export default Test;
