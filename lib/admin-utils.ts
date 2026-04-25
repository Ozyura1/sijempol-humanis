export function calculateAdminStats(allSubmissions: any[]) {
  const stats = {
    totalMonth: 0,
    byStatus: {
      pending: 0,
      verifying: 0,
      approved: 0,
      rejected: 0,
      completed: 0,
    },
    byService: {
      "id-cards": 0,
      births: 0,
      deaths: 0,
      marriages: 0,
      moves: 0,
      "family-cards": 0,
    },
  }

  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  for (const submission of allSubmissions) {
    // Count by status
    const status = submission.status
    if (status in stats.byStatus) {
      stats.byStatus[status as keyof typeof stats.byStatus]++
    }

    // Count by service
    const service = submission.service
    if (service in stats.byService) {
      stats.byService[service as keyof typeof stats.byService]++
    }

    // Count this month
    const submissionDate = new Date(submission.created_at)
    if (submissionDate.getMonth() === currentMonth && submissionDate.getFullYear() === currentYear) {
      stats.totalMonth++
    }
  }

  return stats
}

export function filterSubmissions(submissions: any[], filters: any) {
  let filtered = [...submissions]

  if (filters.service && filters.service !== "all") {
    filtered = filtered.filter((sub) => sub.service === filters.service)
  }

  if (filters.status && filters.status !== "all") {
    if (Array.isArray(filters.status)) {
      filtered = filtered.filter((sub) => filters.status.includes(sub.status))
    } else {
      filtered = filtered.filter((sub) => sub.status === filters.status)
    }
  }

  if (filters.fromDate) {
    filtered = filtered.filter((sub) => new Date(sub.created_at) >= new Date(filters.fromDate))
  }

  if (filters.toDate) {
    filtered = filtered.filter((sub) => new Date(sub.created_at) <= new Date(filters.toDate))
  }

  if (filters.searchTerm) {
    const term = filters.searchTerm.toLowerCase()
    filtered = filtered.filter(
      (sub) =>
        sub.id.toLowerCase().includes(term) ||
        sub.applicant_name.toLowerCase().includes(term) ||
        (sub.user_id && sub.user_id.toLowerCase().includes(term)),
    )
  }

  return filtered
}

export function sortSubmissions(submissions: any[], sortBy: string = "date-desc") {
  let sorted = [...submissions]

  switch (sortBy) {
    case "date-desc":
      sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      break
    case "date-asc":
      sorted.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
      break
    case "name-asc":
      sorted.sort((a, b) => a.applicant_name.localeCompare(b.applicant_name))
      break
    case "name-desc":
      sorted.sort((a, b) => b.applicant_name.localeCompare(a.applicant_name))
      break
    case "status":
      const statusOrder: Record<string, number> = {
        pending: 0,
        verifying: 1,
        approved: 2,
        rejected: 3,
        completed: 4,
        deleted: 5,
      }
      sorted.sort((a, b) => (statusOrder[a.status] || 99) - (statusOrder[b.status] || 99))
      break
    default:
      break
  }

  return sorted
}

export function paginateSubmissions(submissions: any[], page: number = 1, perPage: number = 20) {
  const total = submissions.length
  const pages = Math.ceil(total / perPage)
  const start = (page - 1) * perPage
  const end = start + perPage

  return {
    data: submissions.slice(start, end),
    total,
    pages,
    currentPage: page,
    perPage,
  }
}
