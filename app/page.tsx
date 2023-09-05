import pb from "@/db/pb";
import React from "react";

const Homepage = async () => {
    const lessons = await pb.collection("lessons").getFullList({ fields: "id" });

    console.log(lessons);
    return <div>Homepage</div>;
};

export default Homepage;
