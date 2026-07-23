import List from './List'
import ChatSheet from './ChatSheet'
import LogsPanel from './LogsPanel'
import OnlineUsers from './OnlineUsers'

const dummyLists = [
  {
    _id: '1',
    status: 'todo',
    title: 'Backlog',
    cards: [
      {
        _id: 'a',
        title: 'Set up socket.io server',
        description: 'Create the backend socket connection for real-time updates.',
        assignee: 'Ayesha Khan'
      },
      {
        _id: 'b',
        title: 'Design card detail modal',
        description: 'Build a modal for card details, comments, and attachments.',
        assignee: 'Luis Perez'
      }
    ]
  },
  {
    _id: '2',
    status: 'progress',
    title: 'In Progress',
    cards: [
      {
        _id: 'c',
        title: 'Wire up TanStack Query',
        description: 'Fetch and cache board data from the server using React Query.',
        assignee: 'Madison Ray'
      }
    ]
  },
  {
    _id: '3',
    status: 'done',
    title: 'Done',
    cards: [
      {
        _id: 'd',
        title: 'REST CRUD for lists/cards',
        description: 'Implement create, read, update, delete operations on the API.',
        assignee: 'Noah Smith'
      }
    ]
  }
]

export default function Board() {
  return (
    <div className="min-h-screen bg-zinc-950 pb-12">
      <header className="flex items-center gap-3 px-6 py-4 border-b border-zinc-800">
        <ChatSheet />
        <h1 className="text-lg font-semibold text-zinc-100">Realtime Kanban</h1>
      </header>

      <OnlineUsers />

      <div className="flex gap-4 p-6 overflow-x-auto">
        {dummyLists.map((list) => (
          <List key={list._id} list={list} />
        ))}
      </div>

      <LogsPanel />
    </div>
  )
}