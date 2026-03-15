export default function EmptyState({ icon: Icon, title, desc, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-dark-800 border border-dark-200/10 flex items-center justify-center mb-4">
          <Icon size={28} className="text-dark-200/30" strokeWidth={1.5} />
        </div>
      )}
      <h3 className="font-display font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-dark-200/50 mb-6 max-w-xs">{desc}</p>
      {action}
    </div>
  )
}
