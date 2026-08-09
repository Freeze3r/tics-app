import { useNavigate, useParams } from 'react-router-dom'
import Button from '../components/Button.jsx'
import { LEGAL_DOCS } from '../data/legalDocs.js'

export default function Legal() {
  const navigate = useNavigate()
  const { doc } = useParams()
  const content = LEGAL_DOCS[doc]

  if (!content) {
    return (
      <main className="flex min-h-svh flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-navy-800 dark:text-sand-100">Document introuvable.</p>
        <Button onClick={() => navigate('/')}>Retour à l'accueil</Button>
      </main>
    )
  }

  return (
    <main className="px-6 py-8">
      <div className="mx-auto max-w-md pb-10">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          ← Retour
        </Button>
        <h1 className="mt-4 text-2xl font-bold text-navy-800 dark:text-sand-100">
          {content.title}
        </h1>
        <p className="mt-2 text-xs text-navy-800/50 dark:text-sand-100/50">
          Document indicatif, non relu par un professionnel du droit.
        </p>

        <div className="mt-6 flex flex-col gap-5">
          {content.sections.map((s) => (
            <section key={s.heading}>
              <h2 className="text-sm font-semibold text-teal-600 dark:text-teal-400">
                {s.heading}
              </h2>
              <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-navy-800/80 dark:text-sand-100/80">
                {s.body}
              </p>
            </section>
          ))}
        </div>
      </div>
    </main>
  )
}
