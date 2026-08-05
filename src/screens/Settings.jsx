import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Button from '../components/Button.jsx'
import { getUserSettings, saveUserSettings } from '../lib/userSettings.js'

const AVATARS = ['🌿', '🦋', '🌙', '⭐️', '🌸', '🍃', '🐣', '🌊']
const GENDERS = ['Femme', 'Homme', 'Non-binaire', 'Autre']

function EyeToggle({ hidden, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      title={hidden ? 'Ne pas préciser — activé' : 'Visible pour la personnalisation'}
      className={`shrink-0 rounded-full p-2 text-lg ${hidden ? 'opacity-100' : 'opacity-30'}`}
    >
      {hidden ? '🙈' : '👁️'}
    </button>
  )
}

export default function Settings() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const isOnboarding = searchParams.get('onboarding') === '1'
  const [settings, setSettings] = useState(() => getUserSettings())
  const [saving, setSaving] = useState(false)

  function update(patch) {
    setSettings((prev) => ({ ...prev, ...patch }))
  }

  async function handleSave() {
    setSaving(true)
    await saveUserSettings(settings)
    setSaving(false)
    navigate(isOnboarding ? '/quiz' : '/profil')
  }

  return (
    <main className="px-6 py-8">
      <div className="mx-auto max-w-md pb-6">
        <h1 className="text-2xl font-bold text-navy-800 dark:text-sand-100">
          {isOnboarding ? 'Personnalise ton espace' : 'Modifier mon profil'}
        </h1>
        <p className="mt-1 text-navy-800/60 dark:text-sand-100/60">
          Tout est optionnel. Ces infos servent uniquement à personnaliser ton plan — jamais
          visibles par les autres.
        </p>

        <section className="mt-6 rounded-2xl bg-white p-5 dark:bg-navy-800">
          <label className="flex items-center justify-between">
            <span className="text-sm font-semibold text-navy-800 dark:text-sand-100">
              Mode anonyme complet
            </span>
            <input
              type="checkbox"
              checked={settings.anonymousMode}
              onChange={(e) => update({ anonymousMode: e.target.checked })}
              className="h-5 w-5 accent-coral-500"
            />
          </label>
          <p className="mt-1 text-xs text-navy-800/50 dark:text-sand-100/50">
            Passe directement, sans remplir les champs ci-dessous.
          </p>
        </section>

        {!settings.anonymousMode && (
          <section className="mt-4 rounded-2xl bg-white p-5 dark:bg-navy-800">
            <p className="mb-3 text-sm font-semibold text-teal-600 dark:text-teal-400">
              Avatar
            </p>
            <div className="flex flex-wrap gap-2">
              {AVATARS.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => update({ avatarEmoji: a })}
                  className={`flex h-11 w-11 items-center justify-center rounded-full text-xl ${
                    settings.avatarEmoji === a
                      ? 'bg-coral-100 ring-2 ring-coral-500 dark:bg-coral-500/20'
                      : 'bg-teal-100 dark:bg-teal-700/30'
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>

            <div className="mt-5">
              <label htmlFor="settings-name" className="mb-1 block text-sm font-medium text-navy-800 dark:text-sand-100">
                Prénom ou pseudo
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="settings-name"
                  type="text"
                  value={settings.displayName}
                  onChange={(e) => update({ displayName: e.target.value })}
                  placeholder="Ex : Alex"
                  className="flex-1 rounded-2xl border-2 border-teal-200 bg-transparent px-4 py-3 text-sm text-navy-800 placeholder:text-navy-800/40 focus:border-teal-400 focus:outline-none dark:border-teal-700 dark:text-sand-100"
                />
                <EyeToggle
                  hidden={settings.displayNameHidden}
                  onToggle={() => update({ displayNameHidden: !settings.displayNameHidden })}
                />
              </div>
            </div>

            <div className="mt-3">
              <label htmlFor="settings-age" className="mb-1 block text-sm font-medium text-navy-800 dark:text-sand-100">
                Âge
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="settings-age"
                  type="number"
                  min="13"
                  max="120"
                  value={settings.age}
                  onChange={(e) => update({ age: e.target.value })}
                  placeholder="Ex : 24"
                  className="flex-1 rounded-2xl border-2 border-teal-200 bg-transparent px-4 py-3 text-sm text-navy-800 placeholder:text-navy-800/40 focus:border-teal-400 focus:outline-none dark:border-teal-700 dark:text-sand-100"
                />
                <EyeToggle
                  hidden={settings.ageHidden}
                  onToggle={() => update({ ageHidden: !settings.ageHidden })}
                />
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-navy-800 dark:text-sand-100">Genre</p>
                <EyeToggle
                  hidden={settings.genderHidden}
                  onToggle={() => update({ genderHidden: !settings.genderHidden })}
                />
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {GENDERS.map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => update({ gender: settings.gender === g ? '' : g })}
                    className={`rounded-full border-2 px-4 py-2 text-sm font-medium ${
                      settings.gender === g
                        ? 'border-coral-500 bg-coral-100/60 text-coral-600 dark:bg-coral-500/10 dark:text-coral-300'
                        : 'border-teal-200 text-navy-800/70 dark:border-teal-700 dark:text-sand-100/70'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="mt-4 rounded-2xl bg-white p-5 dark:bg-navy-800">
          <p className="text-sm font-semibold text-teal-600 dark:text-teal-400">
            Profil dans la communauté
          </p>
          <p className="mt-1 text-xs text-navy-800/50 dark:text-sand-100/50">
            Réglage indépendant de tes infos ci-dessus — tu peux être identifiable ici même en
            mode anonyme complet, ou l'inverse.
          </p>

          <div className="mt-3 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => update({ communityPublic: false })}
              className={`rounded-2xl border-2 px-4 py-3 text-left text-sm ${
                !settings.communityPublic
                  ? 'border-coral-500 bg-coral-100/60 dark:bg-coral-500/10'
                  : 'border-teal-200 dark:border-teal-700'
              }`}
            >
              <span className="font-medium text-navy-800 dark:text-sand-100">Anonyme</span>
              <span className="block text-navy-800/60 dark:text-sand-100/60">
                Affiché comme "{settings.communityPseudo || 'Anonyme#0000'}"
              </span>
            </button>
            <button
              type="button"
              onClick={() => update({ communityPublic: true })}
              className={`rounded-2xl border-2 px-4 py-3 text-left text-sm ${
                settings.communityPublic
                  ? 'border-coral-500 bg-coral-100/60 dark:bg-coral-500/10'
                  : 'border-teal-200 dark:border-teal-700'
              }`}
            >
              <span className="font-medium text-navy-800 dark:text-sand-100">
                Public (pseudo visible)
              </span>
            </button>
          </div>

          {settings.communityPublic && (
            <div className="mt-3">
              <label htmlFor="settings-pseudo" className="mb-1 block text-sm font-medium text-navy-800 dark:text-sand-100">
                Pseudo public
              </label>
              <input
                id="settings-pseudo"
                type="text"
                value={settings.communityPseudo}
                onChange={(e) => update({ communityPseudo: e.target.value })}
                placeholder="Ton pseudo public"
                className="w-full rounded-2xl border-2 border-teal-200 bg-transparent px-4 py-3 text-sm text-navy-800 placeholder:text-navy-800/40 focus:border-teal-400 focus:outline-none dark:border-teal-700 dark:text-sand-100"
              />
            </div>
          )}
        </section>

        <Button className="mt-6 w-full" onClick={handleSave} disabled={saving}>
          {saving ? 'Enregistrement…' : isOnboarding ? 'Continuer' : 'Enregistrer'}
        </Button>
        {isOnboarding && (
          <button
            type="button"
            onClick={() => navigate('/quiz')}
            className="mt-3 w-full text-center text-sm text-navy-800/50 dark:text-sand-100/50"
          >
            Passer pour l'instant
          </button>
        )}
      </div>
    </main>
  )
}
