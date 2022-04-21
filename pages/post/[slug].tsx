import client from '../../services/graphql/apolloClient';
//import { bootstrap as bootstrapGlobalAgent } from 'global-agent';
import { getPostsSlugsQuery, getPostBySlugQuery } from '../../services/graphql/queries';
import Header from '../../components/Header';
import { Post } from '../../services/typescript/interfaces';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import { RichText } from '@graphcms/rich-text-react-renderer';
import CommentsForm from '../../components/CommentsForm';

interface Props {
   post: Post
}

interface Params {
   params: {
      slug: String
   }
}

const dateOptions = {
   weekday: 'long',
   year: 'numeric',
   month: 'long',
   day: 'numeric',
   // hour: 'numeric',
   // minute: 'numeric',
   // second: 'numeric'
}

export const getStaticPaths = async () => {
   //bootstrapGlobalAgent();

   const data = await client.query({ query: getPostsSlugsQuery });
   const posts = data.data.posts;

   const paths = posts.map((post: Post) => ({
      params: {
         slug: post.slug
      }
   }))

   return {
      paths,
      fallback: 'blocking'
   }
}

export const getStaticProps = async ({ params }: Params) => {

   //bootstrapGlobalAgent();

   const res = await client.query({
      query: getPostBySlugQuery,
      variables: { slug: params.slug }
   });

   const post = res.data.post

   if (!post) {
      return {
         notFound: true
      }
   }

   return {
      props: {
         post
      },
      revalidate: 3600
   }
}

const SinglePostPage = ({ post }: Props) => {

   //console.log(post);


   return (
      <main>
         <Header />
         <div className='relative w-full h-40'>
            <Image
               src={post.coverImage.url}
               layout='fill'
               objectFit='cover'
               className=''
            />
         </div>

         <article className='max-w-3xl mx-auto p-5'>
            <h1 className='text-3xl mt-10 mb-3'>{post.title}</h1>
            <h2 className='text-xl font-light text-gray-500 mb-2'>{post.excerpt}</h2>

            <div className='flex items-center space-x-2 mb-10'>
               <div className='relative h-10 w-10'>
                  <Image
                     src={post.author.picture.url}
                     layout='fill'
                     objectFit='cover'
                     className='rounded-full'
                  />
               </div>
               <p className='font-extralight text-sm'>
                  Blog post by <span className='text-green-600'>{post.author.name}</span> - Published at {" "}
                  {new Date(post.createdAt).toLocaleString()}
               </p>
            </div>

            <div className='flex flex-col space-y-5 mb-10'>
               {/* <ReactMarkdown className='prose prose-h1:text-red-500 prose-img:w-44'>
                  {post.content.markdown}
               </ReactMarkdown> */}
               <RichText
                  content={post.content.raw}
                  renderers={{
                     h1: ({ children }) => <h1 className='font-bold text-3xl text-red-800'>{children}</h1>,
                     a: ({ children, href, openInNewTab }) => (<a href={href} className='text-blue-500 cursor-pointer underline' target={openInNewTab ? '_blank' : '_self'} rel="noreferrer"> {children} </a>),
                     blockquote: ({ children }) => <blockquote className='pl-4 border-l-4 border-gray-500 italic font-semibold'>{children}</blockquote>,
                     code_block: ({ children }) => <code className='bg-slate-900 text-white p-5 rounded-lg'>{children}</code>,
                     code: ({ children }) => <code className='bg-zinc-200 leading-7 py-1 px-1 rounded text-zinc-800 text-xs border border-zinc-300'>{children}</code>,
                     img: ({ src }) => <img src={src} className='w-full rounded-lg cursor-pointer' />,
                     p: ({ children }) => <p className='text-justify'>{children}</p>
                  }}
               />
            </div>

            <CommentsForm slug={post.slug} />
            {/* <Comments slug={post.slug}/> */}

            {post.comments.length > 0 && (
               <div className='bg-zinc-100 shadow-lg rounded-lg p-8 pb-12 mb-8 space-y-8'>
                  <h3 className='text-xl mb-8 font-semibold border-b pb-4'>{post.comments.length} {post.comments.length == 1 ? 'Comment' : 'Comments'}</h3>
                  {
                     post.comments.map(comment => (
                        <div key={comment.id} className='border-b pb-4'>
                           <span className='font-semibold'>{comment.name}</span> on {new Date(comment.createdAt).toLocaleString('en-US', dateOptions)}
                           <p>{comment.comment}</p>
                        </div>
                     ))
                  }
               </div>
            )}
         </article>
      </main>
   )
}

export default SinglePostPage;

