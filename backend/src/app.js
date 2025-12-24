import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import postRoutes from "./routes/post.routes.js";
import authRoutes from "./routes/auth.routes.js";
import commentRoutes from "./routes/comment.routes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.use(
    cors({
        origin:"http://localhost:5173",
        credentials:true,
    })
);

app.get("/", ()=>{
    message:"API Running..."
});

// routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);

export default app;