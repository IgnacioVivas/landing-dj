import Link from 'next/link';
import { ArrowLeft } from '@phosphor-icons/react/dist/ssr';
import CreateUserForm from '@/app/admin/_components/CreateUserForm';

export default function NewDjPage() {
	return (
		<div>
			<Link
				href="/admin/users"
				className="inline-flex items-center gap-2 font-mono text-xs text-slate-500 hover:text-slate-300 transition-colors mb-8"
			>
				<ArrowLeft size={14} /> Volver
			</Link>

			<div className="mb-10">
				<h1 className="font-display text-5xl text-white tracking-wider mb-2">Nuevo DJ</h1>
				<p className="font-mono text-sm text-slate-500">Creá una cuenta y asignale una suscripción.</p>
			</div>

			<div>
				<CreateUserForm />
			</div>
		</div>
	);
}
