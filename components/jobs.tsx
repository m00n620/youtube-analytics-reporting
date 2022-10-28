import { youtubereporting_v1 } from "googleapis"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"

import { fetchAPI } from "../lib/api"
import styles from "./jobs.module.css"

type ListReportsResponse = youtubereporting_v1.Schema$ListReportsResponse

type Report = youtubereporting_v1.Schema$Report

type ReportType = youtubereporting_v1.Schema$ReportType

type Job = youtubereporting_v1.Schema$Job

const Reports = ({ jobId }: { jobId: string | null | undefined }) => {
  const [reports, setReports] = useState<Report[]>()

  useEffect(() => {
    const fetchReports = async () => {
      const res: ListReportsResponse = await fetchAPI(
        `/youtube/reporting/jobs/${jobId}/reports`
      )
      setReports(res.reports)
    }

    fetchReports()
  }, [])

  if (!jobId || !reports) return null

  return (
    <div>
      {reports.map((report) => (
        <a href={report.downloadUrl!}>{report.id}</a>
      ))}
    </div>
  )
}

export default function Jobs() {
  const { data: session } = useSession()
  const [reportTypes, setReportTypes] = useState<ReportType[]>()
  const [jobs, setJobs] = useState<Job[]>()
  const [name, setName] = useState("")
  const [reportTypeId, setReportTypeId] = useState("")

  const handleCreateJob = async () => {
    if (!name || !reportTypeId) return

    try {
      const job = await fetchAPI(
        "/youtube/reporting/jobs",
        {},
        {
          method: "POST",
          body: JSON.stringify({ name, reportTypeId }),
        }
      )
      if (jobs) {
        setJobs([...jobs, job])
      } else {
        setJobs([job])
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleDeleteJob = async (jobId: string | null | undefined) => {
    if (!jobId) return

    try {
      await fetchAPI(
        `/youtube/reporting/jobs/${jobId}/delete`,
        {},
        { method: "DELETE" }
      )
      setJobs(jobs?.filter((job) => job.id !== jobId))
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const [reportTypesRes, jobsRes] = await Promise.all([
          fetchAPI("/youtube/reporting/reportTypes"),
          fetchAPI("/youtube/reporting/jobs"),
        ])
        setReportTypes(reportTypesRes.reportTypes)
        setJobs(jobsRes.jobs)
      } catch (err) {
        console.log(err)
      }
    }
    if (session) {
      fetchJobs()
    }
  }, [session])

  if (!session) return <></>

  return (
    <>
      <h1>My Jobs</h1>
      <div>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <select
          value={reportTypeId}
          onChange={(e) => setReportTypeId(e.target.value)}
        >
          <option value="">Select report type</option>
          {reportTypes?.map((reportType) => (
            <option key={reportType.id} value={reportType.id!}>
              {reportType.name}
            </option>
          ))}
        </select>
        <button onClick={handleCreateJob}>Create job</button>
      </div>
      {jobs && (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Report Type</th>
              <th>Created At</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id}>
                <td>{job.name}</td>
                <td>
                  {
                    reportTypes?.find(
                      (reportType) => reportType.id === job.reportTypeId
                    )?.name
                  }
                </td>
                <td>{job.createTime}</td>
                <td>
                  <button onClick={() => handleDeleteJob(job.id)}>
                    Delete
                  </button>
                  <Reports jobId={job.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  )
}
