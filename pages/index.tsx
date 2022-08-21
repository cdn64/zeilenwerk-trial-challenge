import { useState } from 'react'
import type { InferGetServerSidePropsType, NextPage } from 'next'
import fetchOrganizations, { OrganizationsResponse } from '../domain/github/fetchOrganizations'
import OrganizationList from '../domain/github/OrganizationList'

export async function getServerSideProps() {
  const { organizations, nextSince } = await fetchOrganizations()

  return { props: { organizations, nextSince } }
}

enum FetchingState {
  Idle,
  Loading,
  Failed,
}

const Home: NextPage<OrganizationsResponse> = ({
  organizations: initialOrganizations,
  nextSince: initialNextSince,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [fetchingState, setFetchingState] = useState<FetchingState>(FetchingState.Idle)
  const [data, setData] = useState({
    organizations: initialOrganizations,
    nextSince: initialNextSince,
  })
  const { organizations, nextSince } = data

  const fetchNewPage = async () => {
    setFetchingState(FetchingState.Loading)
    try {
      const response = await fetch(`http://localhost:3001/api/organizations?since=${nextSince}`)
      const newData = await response.json()

      setData((data) => ({
        organizations: [...data.organizations, ...newData.organizations],
        nextSince: newData.nextSince,
      }))
      setFetchingState(FetchingState.Idle)
    } catch (error) {
      setFetchingState(FetchingState.Failed)
    }
  }

  const renderLoadMore = () => {
    switch (fetchingState) {
      case FetchingState.Idle:
        return <button onClick={fetchNewPage}>Load more</button>
      case FetchingState.Loading:
        return <p>Loading additional organizations…</p>
      case FetchingState.Failed:
        return (
          <>
            <p>Failed to load additional organizations!</p>
            <button onClick={fetchNewPage}>Try again</button>
          </>
        )
    }
  }

  return (
    <div>
      <h1>GitHub organizations</h1>
      <OrganizationList organizations={organizations} />
      {renderLoadMore()}
    </div>
  )
}

export default Home
