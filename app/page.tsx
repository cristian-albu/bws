import pb from "@/db/pb";
import ParseAndRenderHTML from "@/lib/HTMLParser";
import React from "react";

const getLessons = async () => {
    const lessons = await pb.collection("lessons").getFullList({ fields: "content" });
    return lessons[0].content;
};

const Homepage = async () => {
    const Lesson = await getLessons();

    return (
        <div>
            <ParseAndRenderHTML html={Lesson} />
        </div>
    );
};

export default Homepage;
