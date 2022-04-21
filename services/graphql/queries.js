import { gql } from '@apollo/client';

export const getPostsQuery = gql`
   query getPosts {
      posts {
         id
         title
         slug
         excerpt
         createdAt
         coverImage {
            url
            width
            height
         }
         content {
            markdown
            raw
         }
         author {
            name
            picture {
               url
               width
               height
            }
         }
         comments (orderBy: createdAt_DESC) {
            id
            name
            email
            comment
            createdAt
         }
      }
   }
`;

export const getPostsSlugsQuery = gql`
   query getPostsSlugs {
      posts {
         slug
      }
   }
`;

export const getPostBySlugQuery = gql`
   query getPostBySlug ($slug: String!) {
      post (where: {slug: $slug}) {
         id
         title
         slug
         excerpt
         createdAt
         coverImage {
            url
            width
            height
         }
         content {
            markdown
            raw
         }
         author {
            name
            picture {
               url
               width
               height
            }
         }
         comments (orderBy: createdAt_DESC) {
            id
            name
            email
            comment
            createdAt
         }
      }
   }
`;

export const submitCommentQuery = async (obj) => {
   const result = await fetch('/api/comments', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json'
      },
      body: JSON.stringify(obj)
   })

   return result.json();
}

export const getFeaturedPostsQuery = gql`
   query getFeaturedPosts {
      posts (where: {featuredPost: true}) {
         title
         slug
         createdAt
         coverImage {
            url
            width
            height
         }
         author {
            name
            picture {
               url
               width
               height
            }
         }
      }
   }
`;