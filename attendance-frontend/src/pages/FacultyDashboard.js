                        darkMode ? "text-slate-400" : "text-slate-700" // Changed from text-gray-700
                      }`}>
                        {record.student?.name || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                          record.status === "present" 
                            ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400" 
                            : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                        }`}>
                          <div className={`w-2 h-2 rounded-full mr-2 ${
                            record.status === "present" ? "bg-green-500" : "bg-red-500"
                          }`}></div>
                          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                        </span>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${
                        darkMode ? "text-slate-400" : "text-slate-700" // Changed from text-gray-700
                      }`}>
                        {record.markedBy?.name || "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
