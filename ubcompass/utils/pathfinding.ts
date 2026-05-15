/**
 * Indoor Navigation Pathfinding using Dijkstra's Algorithm
 *
 * This module provides pathfinding capabilities for indoor navigation,
 * with support for accessibility routing (avoiding stairs).
 */

export interface GraphNode {
  id: string;
  x: number;
  y: number;
  floor: number;
  roomId?: string;
  isStairs?: boolean;
  isRamp?: boolean;
  connections: string[]; // Array of connected node IDs
}

export interface IndoorGraph {
  nodes: Map<string, GraphNode>;
}

export interface PathResult {
  path: string[]; // Array of node IDs
  coordinates: { x: number; y: number }[];
  distance: number;
  includesFloorChange: boolean;
  floorChangeType?: 'stairs' | 'ramp';
  floorChangeNode?: string;
}

/**
 * Calculate Euclidean distance between two nodes
 */
function euclideanDistance(node1: GraphNode, node2: GraphNode): number {
  const dx = node2.x - node1.x;
  const dy = node2.y - node1.y;
  // Add penalty for floor changes (100 units per floor)
  const floorPenalty = Math.abs(node2.floor - node1.floor) * 100;
  return Math.sqrt(dx * dx + dy * dy) + floorPenalty;
}

/**
 * Dijkstra's Shortest Path Algorithm
 *
 * @param graph - The indoor navigation graph
 * @param startNodeId - Starting node ID
 * @param endNodeId - Destination node ID
 * @param accessibilityMode - If true, avoids stairs (uses only ramps for floor changes)
 * @returns PathResult with the shortest path, or null if no path found
 */
export function findShortestPath(
  graph: IndoorGraph,
  startNodeId: string,
  endNodeId: string,
  accessibilityMode: boolean = false
): PathResult | null {
  const startNode = graph.nodes.get(startNodeId);
  const endNode = graph.nodes.get(endNodeId);

  if (!startNode || !endNode) {
    console.warn('Start or end node not found in graph');
    return null;
  }

  // Initialize data structures
  const distances = new Map<string, number>();
  const previous = new Map<string, string | null>();
  const unvisited = new Set<string>();

  // Initialize all distances to infinity, except start node
  for (const nodeId of graph.nodes.keys()) {
    distances.set(nodeId, nodeId === startNodeId ? 0 : Infinity);
    previous.set(nodeId, null);
    unvisited.add(nodeId);
  }

  while (unvisited.size > 0) {
    // Find unvisited node with smallest distance
    let currentId: string | null = null;
    let minDistance = Infinity;

    for (const nodeId of unvisited) {
      const dist = distances.get(nodeId) ?? Infinity;
      if (dist < minDistance) {
        minDistance = dist;
        currentId = nodeId;
      }
    }

    // No reachable nodes left
    if (currentId === null || minDistance === Infinity) {
      break;
    }

    // Found destination
    if (currentId === endNodeId) {
      break;
    }

    unvisited.delete(currentId);
    const currentNode = graph.nodes.get(currentId)!;

    // Process neighbors
    for (const neighborId of currentNode.connections) {
      if (!unvisited.has(neighborId)) continue;

      const neighborNode = graph.nodes.get(neighborId);
      if (!neighborNode) continue;

      // Skip stairs in accessibility mode
      if (accessibilityMode && neighborNode.isStairs) {
        continue;
      }

      const edgeWeight = euclideanDistance(currentNode, neighborNode);
      const newDistance = (distances.get(currentId) ?? Infinity) + edgeWeight;

      if (newDistance < (distances.get(neighborId) ?? Infinity)) {
        distances.set(neighborId, newDistance);
        previous.set(neighborId, currentId);
      }
    }
  }

  // Reconstruct path
  const path: string[] = [];
  let current: string | null = endNodeId;

  while (current !== null) {
    path.unshift(current);
    current = previous.get(current) ?? null;
  }

  // Check if valid path found
  if (path[0] !== startNodeId) {
    console.warn('No valid path found between nodes');
    return null;
  }

  // Convert path to coordinates and detect floor changes
  const coordinates: { x: number; y: number }[] = [];
  let includesFloorChange = false;
  let floorChangeType: 'stairs' | 'ramp' | undefined;
  let floorChangeNode: string | undefined;

  for (const nodeId of path) {
    const node = graph.nodes.get(nodeId)!;
    coordinates.push({ x: node.x, y: node.y });

    if (node.isStairs || node.isRamp) {
      includesFloorChange = true;
      floorChangeType = node.isStairs ? 'stairs' : 'ramp';
      floorChangeNode = nodeId;
    }
  }

  return {
    path,
    coordinates,
    distance: distances.get(endNodeId) ?? 0,
    includesFloorChange,
    floorChangeType,
    floorChangeNode,
  };
}

/**
 * Build an indoor graph from room data
 * This creates a simplified graph connecting rooms through corridor waypoints
 */
export function buildGraphFromRooms(
  rooms: Array<{
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    floor: number;
    type: string;
  }>
): IndoorGraph {
  const nodes = new Map<string, GraphNode>();
  const corridorY = 190; // Y position of corridor center

  // Create node for each room (using room center as node position)
  for (const room of rooms) {
    const nodeId = `node-${room.id}`;
    const centerX = room.x + room.width / 2;
    const centerY = room.y + room.height / 2;

    nodes.set(nodeId, {
      id: nodeId,
      x: centerX,
      y: centerY,
      floor: room.floor,
      roomId: room.id,
      isStairs: room.type === 'stairs',
      isRamp: room.type === 'ramp',
      connections: [],
    });

    // Create corridor waypoint for each room (connects room to corridor)
    const waypointId = `waypoint-${room.id}`;
    nodes.set(waypointId, {
      id: waypointId,
      x: centerX,
      y: corridorY,
      floor: room.floor,
      connections: [nodeId], // Connect to room
    });

    // Connect room to its waypoint
    nodes.get(nodeId)!.connections.push(waypointId);
  }

  // Connect all waypoints on the same floor (corridor connections)
  const waypointsByFloor = new Map<number, string[]>();
  for (const [id, node] of nodes) {
    if (id.startsWith('waypoint-')) {
      const floorWaypoints = waypointsByFloor.get(node.floor) ?? [];
      floorWaypoints.push(id);
      waypointsByFloor.set(node.floor, floorWaypoints);
    }
  }

  // Sort waypoints by x position and connect adjacent ones
  for (const [floor, waypoints] of waypointsByFloor) {
    const sorted = waypoints.sort((a, b) => {
      const nodeA = nodes.get(a)!;
      const nodeB = nodes.get(b)!;
      return nodeA.x - nodeB.x;
    });

    for (let i = 0; i < sorted.length - 1; i++) {
      const current = nodes.get(sorted[i])!;
      const next = nodes.get(sorted[i + 1])!;
      current.connections.push(sorted[i + 1]);
      next.connections.push(sorted[i]);
    }
  }

  // Connect stairs/ramps across floors
  const stairsNodes: GraphNode[] = [];
  const rampNodes: GraphNode[] = [];

  for (const node of nodes.values()) {
    if (node.isStairs) stairsNodes.push(node);
    if (node.isRamp) rampNodes.push(node);
  }

  // Connect stairs on adjacent floors
  for (let i = 0; i < stairsNodes.length; i++) {
    for (let j = i + 1; j < stairsNodes.length; j++) {
      if (Math.abs(stairsNodes[i].floor - stairsNodes[j].floor) === 1) {
        stairsNodes[i].connections.push(stairsNodes[j].id);
        stairsNodes[j].connections.push(stairsNodes[i].id);
      }
    }
  }

  // Connect ramps on adjacent floors
  for (let i = 0; i < rampNodes.length; i++) {
    for (let j = i + 1; j < rampNodes.length; j++) {
      if (Math.abs(rampNodes[i].floor - rampNodes[j].floor) === 1) {
        rampNodes[i].connections.push(rampNodes[j].id);
        rampNodes[j].connections.push(rampNodes[i].id);
      }
    }
  }

  return { nodes };
}

/**
 * Get room center coordinates for path visualization
 */
export function getRoomCenter(room: { x: number; y: number; width: number; height: number }): { x: number; y: number } {
  return {
    x: room.x + room.width / 2,
    y: room.y + room.height / 2,
  };
}
