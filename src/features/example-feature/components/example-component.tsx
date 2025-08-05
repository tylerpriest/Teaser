import { Button } from '@/shared/components/button'

export function ExampleComponent() {
  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-lg font-semibold mb-2">Example Feature</h2>
      <p className="text-muted-foreground mb-4">
        This is an example component in the modular feature structure.
      </p>
      <Button>Click me</Button>
    </div>
  )
}