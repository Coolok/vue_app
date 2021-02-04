import { Article } from "../components/interfaces/Article";

export class DataModel {
    public static data: Article[] = [];
    public static requestPromise: Promise<any>;

    public static updateComment(article: Article): Promise<any> {
        DataModel.data.forEach((currentArticle: Article)=>{
            if (article.id === currentArticle.id) {
                currentArticle.comments = article.comments;
            }
        });
        //FAKE CRUD SERVER DATA//
        return Promise.resolve();
    }
}