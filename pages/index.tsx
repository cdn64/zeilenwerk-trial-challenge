import { useState } from 'react'
import type { InferGetServerSidePropsType, NextPage } from 'next'
import fetchOrganizations, { OrganizationsResponse } from '../domain/github/fetchOrganizations'
import OrganizationList from '../domain/github/OrganizationList'

export async function getServerSideProps() {
  const { organizations, nextSince } = await fetchOrganizations()

  return { props: { organizations, nextSince } }
}

const Home: NextPage<OrganizationsResponse> = ({
  organizations: initialOrganizations,
  nextSince: initialNextSince,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [data, setData] = useState({
    organizations: initialOrganizations,
    nextSince: initialNextSince,
  })
  const { organizations, nextSince } = data

  const fetchNewPage = async () => {
    const response = await fetch(`http://localhost:3001/api/organizations?since=${nextSince}`)
    const newData = await response.json()

    setData((data) => ({
      organizations: [...data.organizations, ...newData.organizations],
      nextSince: newData.nextSince,
    }))
  }

  return (
    <div>
      <h1>GitHub organizations</h1>
      <OrganizationList organizations={organizations} />
      <button onClick={fetchNewPage}>Load more</button>
    </div>
  )
}

export default Home
