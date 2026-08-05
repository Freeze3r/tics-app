import { useEffect, useState } from 'react'
import { BEHAVIORS } from '../data/behaviors.js'
import { loadProfile } from '../lib/profile.js'
import { isChecked, toggleChecked } from '../lib/checklist.js'

function BehaviorCard({ behavior }) {
  const [open, setOpen] = useState(false)
  const [, forceRender] = useState(0)

  return (
    <div className="rounded-2xl bg-white p-4 dark:bg-navy-800">
      <button
        type="button"
        className="flex w-full items-center justify-between text-left"
        onClick={() => setOpen((o) => !o)}
      >
        <div>
          <div className="font-semibold text-navy-800 dark:text-sand-100">{behavior.label}</div>
          <div className="text-xs text-navy-800/50 dark:text-sand-100/50">{behavior.sublabel}</div>
        </div>
        <span className="text-navy-800/40 dark:text-sand-100/40">{open ? '−' : '+'}</span>
      </button>

      {open && (
        <div className="mt-4 flex flex-col gap-4">
          <p className="text-sm leading-relaxed text-navy-800/70 dark:text-sand-100/70">
            {behavior.mechanism}
          </p>

          <div>
            <p className="mb-2 text-sm font-semibold text-teal-600 dark:text-teal-400">
              Barrières physiques à essayer
            </p>
            <div className="flex flex-col gap-2">
              {behavior.barriers.map((item) => {
                const checked = isChecked(behavior.id, item)
                return (
                  <label
                    key={item}
                    className="flex items-center gap-2 text-sm text-navy-800/80 dark:text-sand-100/80"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {
                        toggleChecked(behavior.id, item)
                        forceRender((n) => n + 1)
                      }}
                      className="h-4 w-4 accent-coral-500"
                    />
                    {item}
                  </label>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Library() {
  const [profile] = useState(() => loadProfile())

  useEffect(() => {
    localStorage.setItem('ticsLibraryVisited', '1')
  }, [])

  const ownIds = new Set(profile?.plan.behaviors.map((b) => b.id) ?? [])
  const ordered = [...BEHAVIORS].sort((a, b) => (ownIds.has(b.id) ? 1 : 0) - (ownIds.has(a.id) ? 1 : 0))

  return (
    <main className="px-6 py-8">
      <div className="mx-auto max-w-md pb-6">
        <h1 className="text-2xl font-bold text-navy-800 dark:text-sand-100">Bibliothèque</h1>
        <p className="mt-1 text-navy-800/60 dark:text-sand-100/60">
          Comprendre ce qui se passe, sans jugement.
        </p>

        <section className="mt-6 rounded-2xl bg-white p-4 dark:bg-navy-800">
          <p className="text-sm font-semibold text-navy-800 dark:text-sand-100">
            Les BFRB, c'est quoi au juste ?
          </p>
          <p className="mt-2 text-sm leading-relaxed text-navy-800/70 dark:text-sand-100/70">
            Les Body-Focused Repetitive Behaviors (BFRB) regroupent les comportements répétitifs
            centrés sur le corps — se ronger les ongles, triturer sa peau, s'arracher les cheveux,
            les tics moteurs ou vocaux. On estime qu'environ 1 personne sur 20 vit avec une forme
            de BFRB à un moment de sa vie, souvent depuis l'enfance ou l'adolescence. Ce sont des
            comportements d'auto-régulation, pas des habitudes qu'on choisit — et surtout pas un
            signe de faiblesse.
          </p>
        </section>

        <section className="mt-4 rounded-2xl bg-teal-100/60 p-4 dark:bg-teal-700/10">
          <p className="text-sm font-semibold text-teal-700 dark:text-teal-300">
            HRT &amp; CBIT, c'est quoi ?
          </p>
          <p className="mt-1 text-sm text-navy-800/70 dark:text-sand-100/70">
            Le Habit Reversal Training (HRT) et le CBIT sont les approches les plus validées
            scientifiquement pour les BFRB et les tics. Le principe : repérer la sensation qui
            précède le geste, et lui opposer un mouvement volontaire incompatible, répété jusqu'à
            devenir automatique. Ce n'est pas de la volonté pure — c'est un entraînement, comme un
            muscle.
          </p>
        </section>

        <section className="mt-6 flex flex-col gap-3">
          {ordered.map((b) => (
            <BehaviorCard key={b.id} behavior={b} />
          ))}
        </section>

        <section className="mt-6 rounded-2xl bg-white p-4 dark:bg-navy-800">
          <p className="text-sm font-semibold text-navy-800 dark:text-sand-100">
            Quand consulter un professionnel ?
          </p>
          <p className="mt-2 text-sm text-navy-800/70 dark:text-sand-100/70">
            L'app est un complément, pas un remplacement. Envisage un dermatologue ou un
            psychologue spécialisé TCC/CBIT si : les dommages tissulaires sont importants, le
            comportement impacte fortement ton quotidien, ou si tu ressens une anxiété ou une
            tristesse marquée en lien avec ça. En parler à un pro n'est jamais un échec.
          </p>
        </section>
      </div>
    </main>
  )
}
