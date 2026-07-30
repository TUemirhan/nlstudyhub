import { useState } from 'react';
import {
  Calculator,
  Home,
  Zap,
  ShoppingCart,
  Bus,
  HeartPulse,
  Coffee,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  Info,
  ArrowRight,
} from 'lucide-react';
import { cities, IND_MONTHLY_AMOUNT, IND_ANNUAL_AMOUNT, getMonthlyTotal } from '@/data/cities';
import { scholarships } from '@/data/scholarships';
import { useRouter } from '@/router';

const costCategories = [
  { key: 'averageRent', label: 'Rent', icon: Home, color: 'navy' },
  { key: 'utilities', label: 'Utilities', icon: Zap, color: 'navy' },
  { key: 'groceries', label: 'Groceries', icon: ShoppingCart, color: 'navy' },
  { key: 'transport', label: 'Transport', icon: Bus, color: 'navy' },
  { key: 'insurance', label: 'Insurance', icon: HeartPulse, color: 'navy' },
  { key: 'leisure', label: 'Leisure', icon: Coffee, color: 'navy' },
] as const;

export function CalculatorPage() {
  const { navigate } = useRouter();
  const [selectedCityId, setSelectedCityId] = useState(cities[1].id);
  const [tuition, setTuition] = useState(15000);
  const [isNonEu, setIsNonEu] = useState(true);
  const [scholarshipSearch, setScholarshipSearch] = useState('');

  const selectedCity = cities.find((c) => c.id === selectedCityId)!;
  const monthlyLiving = getMonthlyTotal(selectedCity);
  const annualLiving = monthlyLiving * 12;

  const indRequired = isNonEu ? IND_ANNUAL_AMOUNT : 0;
  const totalYearOne = annualLiving + tuition + indRequired;

  const filteredScholarships = scholarships.filter((s) => {
    const q = scholarshipSearch.toLowerCase();
    if (!q) return s;
    return (
      s.name.toLowerCase().includes(q) ||
      s.provider.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q)
    );
  });

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <section className="border-b border-slate-200 bg-navy-950 py-16">
        <div className="container-page">
          <div className="mx-auto max-w-3xl">
            <div className="flex items-center gap-2 text-dutch-400">
              <Calculator className="h-5 w-5" />
              <span className="text-sm font-semibold uppercase tracking-wider">Cost of Living & IND Calculator</span>
            </div>
            <h1 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
              Plan your finances with confidence
            </h1>
            <p className="mt-4 text-lg text-slate-300">
              Calculate your IND financial proof, compare living costs across student cities, and
              discover scholarships you may be eligible for.
            </p>
          </div>
        </div>
      </section>

      <div className="container-page py-12">
        {/* IND Financial Proof Calculator */}
        <div className="grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <h2 className="text-xl font-bold text-navy-900">IND Financial Proof Calculator <span className="text-sm font-medium text-slate-400">(2025-2026)</span></h2>
            <p className="mt-1 text-sm text-slate-500">
              Non-EU students must demonstrate sufficient funds to the IND before a visa is issued.
            </p>

            <div className="card mt-5 p-6">
              {/* Nationality toggle */}
              <div className="mb-5">
                <label className="text-sm font-semibold text-navy-800">Your nationality status</label>
                <div className="mt-2 grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setIsNonEu(false)}
                    className={`rounded-lg border-2 px-4 py-2.5 text-sm font-medium transition-all ${
                      !isNonEu ? 'border-navy-600 bg-navy-50 text-navy-800' : 'border-slate-200 text-slate-600 hover:border-navy-300'
                    }`}
                  >
                    EU / EEA (no IND proof)
                  </button>
                  <button
                    onClick={() => setIsNonEu(true)}
                    className={`rounded-lg border-2 px-4 py-2.5 text-sm font-medium transition-all ${
                      isNonEu ? 'border-dutch-500 bg-dutch-50 text-dutch-800' : 'border-slate-200 text-slate-600 hover:border-dutch-300'
                    }`}
                  >
                    Non-EU (IND proof required)
                  </button>
                </div>
              </div>

              {/* Tuition input */}
              <div className="mb-5">
                <label className="text-sm font-semibold text-navy-800">
                  Annual tuition fee (€)
                </label>
                <input
                  type="range"
                  min="2000"
                  max="25000"
                  step="500"
                  value={tuition}
                  onChange={(e) => setTuition(Number(e.target.value))}
                  className="mt-2 w-full accent-navy-700"
                />
                <div className="mt-1 flex items-center justify-between text-sm">
                  <span className="text-slate-400">€2,000</span>
                  <span className="text-lg font-bold text-navy-900">€{tuition.toLocaleString()}</span>
                  <span className="text-slate-400">€25,000</span>
                </div>
              </div>

              {/* City selector */}
              <div className="mb-6">
                <label className="text-sm font-semibold text-navy-800">Your student city</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {cities.map((city) => (
                    <button
                      key={city.id}
                      onClick={() => setSelectedCityId(city.id)}
                      className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-all ${
                        selectedCityId === city.id
                          ? 'border-navy-600 bg-navy-50 text-navy-800'
                          : 'border-slate-200 text-slate-600 hover:border-navy-300'
                      }`}
                    >
                      <MapPin className="h-3.5 w-3.5" />
                      {city.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Results */}
              <div className="rounded-xl bg-slate-50 p-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <div className="text-xs font-medium uppercase tracking-wider text-slate-400">Monthly living costs</div>
                    <div className="mt-1 text-2xl font-extrabold text-navy-900">€{monthlyLiving.toLocaleString()}</div>
                    <div className="text-xs text-slate-500">in {selectedCity.name}</div>
                  </div>
                  <div>
                    <div className="text-xs font-medium uppercase tracking-wider text-slate-400">Annual living costs</div>
                    <div className="mt-1 text-2xl font-extrabold text-navy-900">€{annualLiving.toLocaleString()}</div>
                    <div className="text-xs text-slate-500">12 months</div>
                  </div>
                  {isNonEu && (
                    <>
                      <div className="border-t border-slate-200 pt-4">
                        <div className="text-xs font-medium uppercase tracking-wider text-slate-400">IND required proof</div>
                        <div className="mt-1 text-2xl font-extrabold text-dutch-600">€{indRequired.toLocaleString()}</div>
                        <div className="text-xs text-slate-500">€{IND_MONTHLY_AMOUNT.toLocaleString()}/mo × 12</div>
                      </div>
                      <div className="border-t border-slate-200 pt-4">
                        <div className="text-xs font-medium uppercase tracking-wider text-slate-400">Year 1 total needed</div>
                        <div className="mt-1 text-2xl font-extrabold text-navy-900">€{totalYearOne.toLocaleString()}</div>
                        <div className="text-xs text-slate-500">living + tuition + IND</div>
                      </div>
                    </>
                  )}
                </div>

                {isNonEu && (
                  <div className="mt-4 flex items-start gap-2 rounded-lg border border-dutch-200 bg-dutch-50 p-3">
                    <Info className="mt-0.5 h-4 w-4 shrink-0 text-dutch-600" />
                    <p className="text-sm text-dutch-800">
                      You must transfer the IND amount ({'€' + IND_ANNUAL_AMOUNT.toLocaleString(undefined, { minimumFractionDigits: 2 })}) plus
                      your first year’s tuition to your university. They hold it and release monthly stipends.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* City cost breakdown */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-navy-900">Cost breakdown: {selectedCity.name}</h2>
            <p className="mt-1 text-sm text-slate-500">Monthly estimates for a single student.</p>

            <div className="card mt-5 p-5">
              <div className="space-y-3">
                {costCategories.map((cat) => {
                  const Icon = cat.icon;
                  const value = selectedCity[cat.key] as number;
                  const pct = Math.round((value / monthlyLiving) * 100);
                  return (
                    <div key={cat.key}>
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 font-medium text-slate-700">
                          <Icon className="h-4 w-4 text-navy-600" />
                          {cat.label}
                        </span>
                        <span className="font-bold text-navy-900">€{value}</span>
                      </div>
                      <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-navy-600 transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4">
                <span className="text-sm font-bold text-navy-900">Total / month</span>
                <span className="text-xl font-extrabold text-navy-900">€{monthlyLiving.toLocaleString()}</span>
              </div>
            </div>

            <div className="card mt-4 p-5">
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-dutch-500" />
                <div>
                  <h3 className="text-sm font-bold text-navy-900">{selectedCity.name}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">{selectedCity.description}</p>
                  <p className="mt-2 text-xs font-medium text-dutch-600">Vibe: {selectedCity.vibe}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* City Comparison Table */}
        <div className="mt-16">
          <h2 className="text-xl font-bold text-navy-900">City-by-city comparison</h2>
          <p className="mt-1 text-sm text-slate-500">
            Compare major student hubs side by side. Click a city to use it in the calculator above.
          </p>

          <div className="card mt-5 overflow-x-auto scrollbar-thin">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-left">
                  <th className="px-5 py-3 font-semibold text-navy-800">City</th>
                  <th className="px-5 py-3 font-semibold text-navy-800">Rent (avg)</th>
                  <th className="px-5 py-3 font-semibold text-navy-800">Rent range</th>
                  <th className="px-5 py-3 font-semibold text-navy-800">Utilities</th>
                  <th className="px-5 py-3 font-semibold text-navy-800">Groceries</th>
                  <th className="px-5 py-3 font-semibold text-navy-800">Insurance</th>
                  <th className="px-5 py-3 font-semibold text-navy-800">Monthly total</th>
                  <th className="px-5 py-3 font-semibold text-navy-800">Students</th>
                </tr>
              </thead>
              <tbody>
                {cities.map((city) => {
                  const total = getMonthlyTotal(city);
                  const isActive = city.id === selectedCityId;
                  return (
                    <tr
                      key={city.id}
                      onClick={() => setSelectedCityId(city.id)}
                      className={`cursor-pointer border-b border-slate-100 transition-colors ${
                        isActive ? 'bg-navy-50' : 'hover:bg-slate-50'
                      }`}
                    >
                      <td className="px-5 py-3 font-semibold text-navy-900">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-dutch-500" />
                          {city.name}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-slate-600">€{city.averageRent}</td>
                      <td className="px-5 py-3 text-slate-500">€{city.rentRange[0]}–€{city.rentRange[1]}</td>
                      <td className="px-5 py-3 text-slate-600">€{city.utilities}</td>
                      <td className="px-5 py-3 text-slate-600">€{city.groceries}</td>
                      <td className="px-5 py-3 text-slate-600">€{city.insurance}</td>
                      <td className="px-5 py-3 font-bold text-navy-900">€{total.toLocaleString()}</td>
                      <td className="px-5 py-3 text-slate-500">{city.studentPopulation.toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Scholarship Repository */}
        <div className="mt-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-navy-900">Scholarship repository</h2>
              <p className="mt-1 text-sm text-slate-500">
                Searchable database of scholarships for international students, with stackability rules.
              </p>
            </div>
            <input
              type="text"
              value={scholarshipSearch}
              onChange={(e) => setScholarshipSearch(e.target.value)}
              placeholder="Search scholarships..."
              className="input max-w-xs"
            />
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredScholarships.map((sch) => (
              <div key={sch.id} className="card-hover flex flex-col p-5">
                <div className="flex items-center justify-between gap-2">
                  <span className={`badge ${
                    sch.nationality === 'non-eu' ? 'bg-dutch-50 text-dutch-700' :
                    sch.nationality === 'eu' ? 'bg-navy-50 text-navy-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {sch.nationality === 'non-eu' ? 'Non-EU only' : sch.nationality === 'eu' ? 'EU only' : 'All nationalities'}
                  </span>
                  <span className="badge bg-slate-100 text-slate-600">
                    {sch.degreeLevel === 'both' ? 'BSc + MSc' : sch.degreeLevel === 'master' ? 'MSc/MA' : 'BSc/BA'}
                  </span>
                </div>
                <h3 className="mt-3 text-base font-bold text-navy-900">{sch.name}</h3>
                <p className="mt-1 text-xs text-slate-500">{sch.provider}</p>
                <div className="mt-3 text-2xl font-extrabold text-navy-800">
                  €{sch.amount.toLocaleString()}
                </div>
                <p className="mt-2 flex-1 text-xs leading-relaxed text-slate-500">{sch.description}</p>

                <div className="mt-3 border-t border-slate-100 pt-3">
                  <div className="flex items-center gap-1.5 text-xs">
                    {sch.stackable ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5 text-dutch-500" />
                        <span className="font-medium text-dutch-700">Stackable</span>
                        <span className="text-slate-400">— {sch.stackableWith.join(', ')}</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="h-3.5 w-3.5 text-slate-400" />
                        <span className="font-medium text-slate-500">Not stackable</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Deadline: <span className="font-semibold text-navy-700">{sch.deadline}</span></span>
                  <a
                    href={sch.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-navy-700 hover:text-dutch-600"
                  >
                    Apply →
                  </a>
                </div>
              </div>
            ))}
          </div>

          {filteredScholarships.length === 0 && (
            <p className="mt-6 text-center text-sm text-slate-500">No scholarships match your search.</p>
          )}
        </div>

        {/* CTA */}
        <div className="mt-12 rounded-2xl bg-navy-950 p-8 text-center">
          <h3 className="text-xl font-bold text-white">Found your budget? Find your program.</h3>
          <p className="mt-2 text-sm text-slate-400">
            Browse English-taught programs and check deadlines, seats, and requirements.
          </p>
          <button onClick={() => navigate({ name: 'programs' })} className="btn-accent mt-5">
            Open Program Finder
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
