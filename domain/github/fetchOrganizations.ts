import parse from 'parse-link-header'
import { pick } from 'lodash/fp'

const githubAccessToken = process.env.GITHUB_ACCESS_TOKEN

export type Organization = {
  id: number
  login: string
}
export type OrganizationsResponse = {
  organizations: Organization[]
  nextSince: number
}

export default async function fetchOrganizations(since?: string): Promise<OrganizationsResponse> {
  let url = 'https://api.github.com/organizations'
  if (since) url = url + `?since=${since}`

  const data = await fetch(url, {
    headers: {
      Authorization: `token ${githubAccessToken}`,
    },
  })
  let organizations: Organization[] = await data.json()
  organizations = organizations.map(pick(['login', 'id']))

  const nextSince = parseInt(parse(data.headers.get('Link'))?.next.since || '', 10)

  return { organizations, nextSince }
}
