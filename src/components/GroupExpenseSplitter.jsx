import { useMemo, useState } from 'react'
import {
  Calculator,
  Check,
  Coins,
  Copy,
  Plus,
  Trash2,
  Users,
} from 'lucide-react'

// Smart settlement algorithm: matches debtors and creditors
function calculateSettlements(members, expenses, baseItineraryCostPerPerson) {
  // Balance map: net amount each member is owed (+) or owes (-)
  const balances = {}
  members.forEach((m) => {
    balances[m] = -baseItineraryCostPerPerson // initial share of base costs
  })

  // Add all logged expenses
  expenses.forEach((exp) => {
    const amount = Number(exp.amount) || 0
    if (amount <= 0) return

    // Payer gets credit
    balances[exp.paidBy] = (balances[exp.paidBy] || 0) + amount

    // Split members share deduction
    const splitCount = exp.splitAmong?.length || members.length
    const share = amount / splitCount
    const targets = exp.splitAmong?.length ? exp.splitAmong : members

    targets.forEach((m) => {
      balances[m] = (balances[m] || 0) - share
    })
  })

  // Separate into debtors (owes money, balance < -1) and creditors (gets money, balance > 1)
  const debtors = []
  const creditors = []

  Object.entries(balances).forEach(([name, net]) => {
    const rounded = Math.round(net)
    if (rounded < -1) debtors.push({ name, amount: Math.abs(rounded) })
    else if (rounded > 1) creditors.push({ name, amount: rounded })
  })

  const settlements = []
  let dIdx = 0
  let cIdx = 0

  while (dIdx < debtors.length && cIdx < creditors.length) {
    const debtor = debtors[dIdx]
    const creditor = creditors[cIdx]
    const settleAmount = Math.min(debtor.amount, creditor.amount)

    if (settleAmount > 0) {
      settlements.push({
        from: debtor.name,
        to: creditor.name,
        amount: Math.round(settleAmount),
      })
    }

    debtor.amount -= settleAmount
    creditor.amount -= settleAmount

    if (debtor.amount <= 1) dIdx++
    if (creditor.amount <= 1) cIdx++
  }

  return { balances, settlements }
}

export default function GroupExpenseSplitter({
  travellerCount = 2,
  baseItineraryCostPerPerson = 1200,
  days = 2,
}) {
  const [memberOverrides, setMemberOverrides] = useState({})

  // Derive members from travellerCount and any custom overrides
  const members = useMemo(() => {
    return Array.from({ length: travellerCount }, (_, i) => {
      return memberOverrides[i] || `Traveller ${i + 1}`
    })
  }, [travellerCount, memberOverrides])

  // Custom expenses log
  const [expenses, setExpenses] = useState([
    {
      id: 1,
      title: 'Airport / Station Cab',
      amount: 650,
      paidBy: 'Traveller 1',
      splitAmong: ['Traveller 1', 'Traveller 2'],
    },
    {
      id: 2,
      title: 'Heritage Dinner at Hotel Shadab',
      amount: 1200,
      paidBy: 'Traveller 2',
      splitAmong: ['Traveller 1', 'Traveller 2'],
    },
  ])

  // New expense form inputs
  const [newTitle, setNewTitle] = useState('')
  const [newAmount, setNewAmount] = useState('')
  const [newPaidBy, setNewPaidBy] = useState(members[0] || 'Traveller 1')
  const [copiedSummary, setCopiedSummary] = useState(false)

  // Calculations
  const { balances, settlements } = useMemo(() => {
    return calculateSettlements(members, expenses, baseItineraryCostPerPerson)
  }, [members, expenses, baseItineraryCostPerPerson])

  const totalCustomExpenses = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0)
  const totalTripCostPerPerson = Math.round(
    baseItineraryCostPerPerson + totalCustomExpenses / (members.length || 1)
  )

  const handleAddExpense = (e) => {
    e.preventDefault()
    const amt = Number(newAmount)
    if (!newTitle.trim() || isNaN(amt) || amt <= 0) return

    setExpenses((prev) => [
      ...prev,
      {
        id: Date.now(),
        title: newTitle.trim(),
        amount: amt,
        paidBy: newPaidBy,
        splitAmong: members,
      },
    ])

    setNewTitle('')
    setNewAmount('')
  }

  const handleDeleteExpense = (id) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id))
  }

  const handleRenameMember = (index, newName) => {
    if (!newName.trim()) return
    const oldName = members[index]
    const trimmed = newName.trim()
    setMemberOverrides((prev) => ({
      ...prev,
      [index]: trimmed,
    }))
    // Update existing expenses paidBy and splitAmong
    setExpenses((prev) =>
      prev.map((e) => ({
        ...e,
        paidBy: e.paidBy === oldName ? trimmed : e.paidBy,
        splitAmong: e.splitAmong.map((m) => (m === oldName ? trimmed : m)),
      }))
    )
  }

  const copySettlementSummary = () => {
    let text = `💰 Explorex Trip Expense Settlement (${days} Days · ${members.length} Travellers)\n\n`
    text += `Total Expense Logged: ₹${(totalTripCostPerPerson * members.length).toLocaleString('en-IN')}\n`
    text += `Average Cost per Person: ₹${totalTripCostPerPerson.toLocaleString('en-IN')}\n\n`
    text += `📊 Member Balances:\n`
    Object.entries(balances).forEach(([name, net]) => {
      const rounded = Math.round(net)
      const sign = rounded >= 0 ? `+₹${rounded}` : `-₹${Math.abs(rounded)}`
      text += `• ${name}: ${sign} (${rounded >= 0 ? 'Gets back' : 'Owes'})\n`
    })

    text += `\n🤝 Recommended Settlements:\n`
    if (settlements.length === 0) {
      text += `• All expenses are settled up evenly!\n`
    } else {
      settlements.forEach((s) => {
        text += `• ${s.from} pays ${s.to} ₹${s.amount.toLocaleString('en-IN')}\n`
      })
    }

    navigator.clipboard?.writeText?.(text)
    setCopiedSummary(true)
    setTimeout(() => setCopiedSummary(false), 2500)
  }

  return (
    <div className="group-expense-splitter-card">
      <div className="splitter-header">
        <div className="splitter-title-block">
          <div className="splitter-icon-wrap">
            <Coins size={20} />
          </div>
          <div>
            <h4>Group Expense Splitter</h4>
            <p>Split tickets, meals, stays, and shared cabs across all {members.length} travellers</p>
          </div>
        </div>

        <button
          type="button"
          className="copy-settlement-btn"
          onClick={copySettlementSummary}
          title="Copy expense settlement summary to share with group"
        >
          {copiedSummary ? <Check size={14} /> : <Copy size={14} />}
          <span>{copiedSummary ? 'Copied Summary!' : 'Copy Settlements'}</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="splitter-kpi-grid">
        <div className="kpi-mini-card">
          <span className="kpi-label">Base Plan Share</span>
          <strong className="kpi-val">₹{baseItineraryCostPerPerson.toLocaleString('en-IN')}</strong>
          <span className="kpi-sub">Tickets, stay &amp; daily food</span>
        </div>
        <div className="kpi-mini-card">
          <span className="kpi-label">Custom Logged</span>
          <strong className="kpi-val">₹{totalCustomExpenses.toLocaleString('en-IN')}</strong>
          <span className="kpi-sub">{expenses.length} shared expense{expenses.length > 1 ? 's' : ''}</span>
        </div>
        <div className="kpi-mini-card highlight">
          <span className="kpi-label">Total / Person</span>
          <strong className="kpi-val">₹{totalTripCostPerPerson.toLocaleString('en-IN')}</strong>
          <span className="kpi-sub">Net average cost</span>
        </div>
      </div>

      {/* Group Members Custom Names Row */}
      <div className="members-naming-row">
        <span className="members-naming-label">
          <Users size={13} /> Group Members:
        </span>
        <div className="members-chips-wrap">
          {members.map((name, idx) => (
            <input
              key={idx}
              type="text"
              className="member-name-input"
              value={name}
              onChange={(e) => handleRenameMember(idx, e.target.value)}
              title="Click to rename traveller"
            />
          ))}
        </div>
      </div>

      {/* Settlement Transactions Summary Card */}
      <div className="settlement-results-box">
        <h5 className="settlement-box-title">
          <Calculator size={14} /> Who Owes Whom (Net Settlements)
        </h5>

        {settlements.length === 0 ? (
          <div className="all-settled-pill">
            <Check size={14} /> All expenses are currently balanced and settled!
          </div>
        ) : (
          <div className="settlements-pills-list">
            {settlements.map((s, idx) => (
              <div key={idx} className="settlement-trans-item">
                <span className="payer-debtor">{s.from}</span>
                <span className="owes-tag">owes</span>
                <span className="payer-creditor">{s.to}</span>
                <strong className="settle-amt">₹{s.amount.toLocaleString('en-IN')}</strong>
              </div>
            ))}
          </div>
        )}

        {/* Member Balances Mini Strip */}
        <div className="member-net-balances-strip">
          {members.map((name) => {
            const net = Math.round(balances[name] || 0)
            const isPositive = net >= 0
            return (
              <div key={name} className={`member-balance-item ${isPositive ? 'positive' : 'negative'}`}>
                <span className="m-name">{name}</span>
                <span className="m-net">
                  {isPositive ? `+₹${net}` : `-₹${Math.abs(net)}`}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Add New Expense Form */}
      <form className="add-expense-form" onSubmit={handleAddExpense}>
        <div className="form-input-col title-col">
          <label>Expense Name</label>
          <input
            type="text"
            placeholder="e.g. Airport cab, Shadab dinner"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-input-col amt-col">
          <label>Amount (₹)</label>
          <input
            type="number"
            placeholder="₹ Amount"
            value={newAmount}
            onChange={(e) => setNewAmount(e.target.value)}
            min="1"
            required
          />
        </div>

        <div className="form-input-col payer-col">
          <label>Paid By</label>
          <select value={newPaidBy} onChange={(e) => setNewPaidBy(e.target.value)}>
            {members.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="add-expense-submit-btn">
          <Plus size={14} /> Add Expense
        </button>
      </form>

      {/* Expenses Log Table */}
      {expenses.length > 0 && (
        <div className="expenses-log-table-wrap">
          <table className="expenses-log-table">
            <thead>
              <tr>
                <th>Expense</th>
                <th>Paid By</th>
                <th>Amount</th>
                <th>Split</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((exp) => (
                <tr key={exp.id}>
                  <td>
                    <strong>{exp.title}</strong>
                  </td>
                  <td>
                    <span className="paid-by-pill">{exp.paidBy}</span>
                  </td>
                  <td>
                    <strong>₹{Number(exp.amount).toLocaleString('en-IN')}</strong>
                  </td>
                  <td>
                    <span className="split-count-badge">
                      All {members.length} members (₹{Math.round(exp.amount / members.length)}/ea)
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="delete-exp-btn"
                      onClick={() => handleDeleteExpense(exp.id)}
                      title="Delete expense"
                    >
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
