import { TextComment } from "./TextComment";

export interface Article {
    id: string;
    category: string;
    comments: TextComment[];
    title: string;
    text: string;
    author: string;
    selected: boolean;
}