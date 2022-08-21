import type { NextApiRequest, NextApiResponse } from 'next'

import fetchOrganizations, { OrganizationsResponse } from '../../domain/github/fetchOrganizations'

export default async function organizations(
  req: NextApiRequest,
  res: NextApiResponse<OrganizationsResponse>
) {
  const querySince = req.query['since']
  const since = Array.isArray(querySince) ? querySince[0] : querySince || ''

  const { organizations, nextSince } = await fetchOrganizations(since)

  res.status(200).json({ organizations, nextSince })
}
