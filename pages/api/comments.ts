// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { ApolloClient, gql, InMemoryCache } from '@apollo/client';
import { bootstrap as bootstrapGlobalAgent } from 'global-agent';

const graphqlAPI = process.env.NEXT_PUBLIC_GRAPHCMS_URI;
const graphcmsToken = process.env.GRAPHCMS_TOKEN;

type Data = {
  name: string
}

export default async function comments(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { name, email, slug, comment } = req.body;

  bootstrapGlobalAgent();

  const graphQLClient = new ApolloClient({
    uri: graphqlAPI,
    cache: new InMemoryCache(),
    headers: {
      authorization: `Bearer ${graphcmsToken}`
    }
  })

  const queryCreateComment = gql`
    mutation CreateComment ($name: String!, $email: String!, $comment: String!, $slug: String!) {
      createComment(data: { name: $name, email: $email, comment: $comment, post: { connect: {slug: $slug} } }) { id }
    }
  `;

  try {
    const result = await graphQLClient.mutate({
      mutation: queryCreateComment,
      variables: req.body
    });

    return res.status(200).send(result);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error)
    
  }


}
