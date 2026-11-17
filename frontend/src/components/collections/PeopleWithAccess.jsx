import { useState } from "react";
import { Search, UserRoundPlus } from "lucide-react";
import { mockUsers } from "../../data/mockUsers";
import { getRoleOptions } from "../../data/collections";

const roleLabels = {
  collaborator: "Collaborator",
  viewer: "Viewer",
};

function Avatar({ username }) {
  return (
    <span
      aria-hidden="true"
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-100 text-sm font-semibold uppercase text-violet-700"
    >
      {username.charAt(0)}
    </span>
  );
}

// Add people by username and manage who has access to a collection.
// Controlled: the parent owns `members` and gets every change through `onMembersChange`.
export default function PeopleWithAccess({
  ownerUsername,
  members,
  onMembersChange,
  visibility,
  currentUsername,
}) {
  const roleOptions = getRoleOptions(visibility);
  const [query, setQuery] = useState("");
  const [newRole, setNewRole] = useState(roleOptions[0]);
  const [error, setError] = useState("");

  const roleForNewPerson = roleOptions.includes(newRole) ? newRole : roleOptions[0];
  const takenUsernames = [ownerUsername, ...members.map((person) => person.username)];
  const trimmedQuery = query.trim().replace(/^@/, "").toLowerCase();
  const suggestions = trimmedQuery
    ? mockUsers.filter(
        (username) => username.toLowerCase().includes(trimmedQuery) && !takenUsernames.includes(username)
      )
    : [];

  const addPerson = (username) => {
    onMembersChange([...members, { username, role: roleForNewPerson }]);
    setQuery("");
    setError("");
  };

  const handleKeyDown = (event) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    if (!trimmedQuery) return;
    const exactMatch = mockUsers.find((username) => username.toLowerCase() === trimmedQuery);
    if (exactMatch && takenUsernames.includes(exactMatch)) {
      setError(`@${exactMatch} already has access.`);
    } else if (exactMatch) {
      addPerson(exactMatch);
    } else if (suggestions.length === 1) {
      addPerson(suggestions[0]);
    } else {
      setError(`No user found with the username "${trimmedQuery}".`);
    }
  };

  const changeRole = (username, value) => {
    if (value === "remove") {
      onMembersChange(members.filter((person) => person.username !== username));
    } else {
      onMembersChange(
        members.map((person) => (person.username === username ? { ...person, role: value } : person))
      );
    }
  };

  return (
    <div>
      <label
        htmlFor="add-people-input"
        className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#1f2757]"
      >
        <UserRoundPlus className="h-5 w-5 text-violet-600" aria-hidden="true" />
        Add people
      </label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-100">
            <Search className="h-5 w-5 shrink-0 text-slate-400" aria-hidden="true" />
            <input
              id="add-people-input"
              type="search"
              autoComplete="off"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setError("");
              }}
              onKeyDown={handleKeyDown}
              placeholder="Add people by username"
              aria-describedby={error ? "add-people-error" : undefined}
              className="w-full bg-transparent text-sm text-slate-700 outline-none"
            />
          </div>
          {suggestions.length > 0 && (
            <ul
              role="listbox"
              aria-label="Matching users"
              className="absolute left-0 right-0 top-full z-10 mt-1 max-h-48 overflow-y-auto rounded-xl border border-slate-200 bg-white py-1 shadow-lg"
            >
              {suggestions.map((username) => (
                <li key={username} role="option" aria-selected="false">
                  <button
                    type="button"
                    onClick={() => addPerson(username)}
                    className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-slate-700 hover:bg-violet-50"
                  >
                    <Avatar username={username} />
                    @{username}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <select
          aria-label="Role for the person you add"
          value={roleForNewPerson}
          onChange={(event) => setNewRole(event.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700"
        >
          {roleOptions.map((role) => (
            <option key={role} value={role}>
              {roleLabels[role]}
            </option>
          ))}
        </select>
      </div>
      {error && (
        <p id="add-people-error" role="alert" className="mt-2 text-xs font-medium text-red-600">
          {error}
        </p>
      )}

      <h3 className="mt-6 text-sm font-semibold text-[#1f2757]">People with access</h3>
      <ul className="mt-3 flex max-h-56 flex-col gap-1 overflow-y-auto">
        <li className="flex items-center gap-3 py-2">
          <Avatar username={ownerUsername} />
          <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-800">
            @{ownerUsername}
            {ownerUsername === currentUsername && <span className="text-slate-400"> (you)</span>}
          </span>
          <span className="px-3 text-sm text-slate-500">Owner</span>
        </li>
        {members.map((person) => (
          <li key={person.username} className="flex items-center gap-3 py-2">
            <Avatar username={person.username} />
            <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-800">
              @{person.username}
              {person.username === currentUsername && <span className="text-slate-400"> (you)</span>}
            </span>
            <select
              aria-label={`Access for @${person.username}`}
              value={person.role}
              onChange={(event) => changeRole(person.username, event.target.value)}
              className="rounded-lg border border-transparent bg-transparent px-2 py-1 text-sm text-slate-600 hover:border-slate-200"
            >
              {roleOptions.map((role) => (
                <option key={role} value={role}>
                  {roleLabels[role]}
                </option>
              ))}
              {!roleOptions.includes(person.role) && (
                <option value={person.role}>{roleLabels[person.role] ?? person.role}</option>
              )}
              <option value="remove">Remove access</option>
            </select>
          </li>
        ))}
      </ul>
    </div>
  );
}
