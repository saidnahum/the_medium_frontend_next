export interface Post {
   id: String;
   title: String;
   slug: String;
   excerpt: String;
   createdAt: Date;
   coverImage: {
      url: String;
      width: Number
      height: Number

   }
   content: {
      markdown: String
      raw: String
   }
   author: {
      name: String;
      picture: {
         url: String
         width: Number
         height: Number
      }
   }
   comments: {
      id: String,
      name: String;
      email: String;
      comment: String;
      createdAt: String;
   }
}