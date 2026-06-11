import "../global.css";
import Link from "next/link";

type Exercise = {
  id: number;
  title: string;
  category: string;
  difficulty: string;
};

const exercises: Exercise[] = [
  {
    id: 1,
    title: "Wippen",
    category: "Schaukelringe",
    difficulty: "Mittel",
  },
  {
    id: 2,
    title: "Salto vorwärts",
    category: "Mini-Trampolin",
    difficulty: "Fortgeschritten",
  },
  {
    id: 3,
    title: "Sturzhang",
    category: "Schaukelringe",
    difficulty: "Anfänger",
  },
];

export default function ExercisesPage() {
  return (
    <main className="p-6">
      <Link href="/" className="back-link">
        &larr; Zurück
      </Link>

      <h1 className="text-3xl font-bold mb-6">Übungen</h1>

      <div className="grid gap-4">
        {exercises.map((exercise) => (
          <article key={exercise.id} className="border rounded-xl p-4 shadow-sm">
            <div>
              <h2 className="text-xl font-semibold">{exercise.title}</h2>
              <p className="text-gray-600">{exercise.category}</p>
            </div>

            <span className="badge">{exercise.difficulty}</span>
          </article>
        ))}
      </div>
    </main>
  );
}
