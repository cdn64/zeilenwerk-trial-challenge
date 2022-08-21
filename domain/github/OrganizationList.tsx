import { Organization } from './fetchOrganizations'

type OrganizationListProps = {
  organizations: Organization[]
}

export default function OrganizationList({ organizations }: OrganizationListProps) {
  return (
    <ul>
      {(organizations || []).map((organization) => {
        return <li key={organization.id}>{organization.login}</li>
      })}
    </ul>
  )
}
