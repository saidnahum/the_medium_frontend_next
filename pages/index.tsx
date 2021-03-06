import type { NextPage } from 'next'
import Head from 'next/head'
import Header from '../components/Header'
import mediumMLogo from '../assets/img/medium-m.png'
import Image from 'next/image'
//import { bootstrap as bootstrapGlobalAgent } from 'global-agent';
import client from '../services/graphql/apolloClient';
import { getPostsQuery, getFeaturedPostsQuery } from '../services/graphql/queries';
import { Post } from '../services/typescript/interfaces';
import Link from 'next/link'
import FeaturedPosts from '../sections/FeaturedPosts'

interface Posts {
	posts: [Post];
}

const Home = ({posts, featuredPosts}: Posts) => {
	//console.log(posts);
	//console.log(featuredPosts);
	
	return (
		<div className='max-w-7xl mx-auto'>
			<Head>
				<title>Create Next App</title>
				<meta name="description" content="Generated by create next app" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<Header />

			<div className='flex justify-between items-center bg-yellow-400 border-y border-black py-10 lg:py-0 mb-10'>
				<div className='px-10 space-y-5'>
					<h1 className='text-6xl max-w-xl font-serif'><span className='underline decoration-black decoration-4'>Medium</span> is a place to write, read and connect</h1>
					<h2>It's easy and free to post your thinking on any topic and connect with millios of readers</h2>
				</div>

				<div className=''>
					<div className='hidden md:inline-flex h-32 lg:h-96'>
						<Image src={mediumMLogo} 
							alt='Medium Logo M' 
							objectFit='contain'
						/>
					</div>
				</div>
			</div>

			<FeaturedPosts featuredPosts={featuredPosts}/>

			{/* Posts */}
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 p-2 md:p-6'>
				{posts.map((post) => (
					<Link key={post.id} href={`/post/${post.slug}`}>
						<div className='group cursor-pointer border rounded-lg overflow-hidden'>
							<div className='group-hover:scale-110 transition-transform duration-200 ease-in-out'>
								<Image 
									src={post.coverImage.url}
									alt='Post Image'
									width={post.coverImage.width}
									height={post.coverImage.height}
									layout='responsive'
								/>
							</div>

							<div className='flex justify-between p-5 bg-white items-center space-x-5'>
								<div className=''>
									<p className='text-lg line-clamp-1 font-bold'>{post.title}</p>
									<p className='text-xs line-clamp-3'><span className=''>{post.excerpt}</span> by {post.author.name}</p>
								</div>

								<div className='flex items-center w-20 h-20'>
									<Image
										src={post.author.picture.url}
										alt='Author Image'
										width={post.author.picture.width}
										height={post.author.picture.height}
										className='rounded-full'
									/>
								</div>
							</div>
						</div>
					</Link>
				))}
			</div>
		</div>
	)
}

export default Home

export const getServerSideProps = async (context) => {
	
	//const { res } = context;
  	//res.setHeader('Cache-Control', `s-maxage=60, stale-while-revalidate`) 

	//bootstrapGlobalAgent();
	const data = await client.query({query: getPostsQuery});
	const posts = data.data.posts;

	const resFeaturedPosts = await client.query({ query: getFeaturedPostsQuery})
	const featuredPosts = resFeaturedPosts.data.posts;
	
	
	//posts?.map(post => console.log(post.slug));
	
	
	return {
		props: {
			posts,
			featuredPosts
		}
	}
}
