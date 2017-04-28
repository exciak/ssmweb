package com.klw.oa.utils;

import com.google.gson.*;
import org.apache.commons.lang.StringUtils;
import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.node.ObjectNode;

import java.io.IOException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;

public class JsonUtil {
	private static DXPLog logger = new DXPLog(JsonUtil.class);

	/**
	 * 将json转化为实体POJO
	 * @param jsonStr
	 * @param obj
	 * @return
	 */
	public static<T> Object JSONToObj(String jsonStr, Class<T> obj) {
		T t = null;
		try {
			ObjectMapper objectMapper = new ObjectMapper();
			t = objectMapper.readValue(jsonStr, obj);
		} catch (Exception e) {
			logger.error(e);
		}
		return t;
	}

	/* <key， value>map转化为json string*/
	public static String getJsonStr(Object object){
		String result = null;
		try {
			ObjectMapper mapper = new ObjectMapper();
			result = mapper.writeValueAsString(object);
		} catch (Exception e) {
			logger.error(e);
		}
		return result;
	}

	/*解析出json tree*/
	public static JsonNode decodeJsonString(String jsonStr) {
		if ((null == jsonStr) || (jsonStr.isEmpty())) {
			return null;
		}
		JsonNode root = null;
		try {
			ObjectMapper mapper = new ObjectMapper();
			root = mapper.readTree(jsonStr);
		}catch (Exception e) {
			logger.error("[JsonUtil][decodeJsonString] error, " + jsonStr, e);
		}

		return root;
	}

	/*保留指定key的json string，只能保留jsonStr第一级key，不能嵌套保留*/
	public static String retain(String jsonStr, String... eName) {
		ObjectMapper oMapper = new ObjectMapper();
		String resStr = "";
		if (null != jsonStr) {
			try {
				ObjectNode root = (ObjectNode) oMapper.readTree(jsonStr);

				if (null != root) {
					root.retain(eName);
					resStr = oMapper.writeValueAsString(root);
				}
			} catch (Exception e) {
				logger.error("[JsonUtil][retain] error, " + jsonStr, e);
			}
		}

		return resStr;
	}

	public static Object getJsonStr(Class clazz, String jsonStr) throws IOException {
		Gson gson = new Gson();
		gson.getAdapter(clazz).fromJson(jsonStr);

		return gson.getAdapter(clazz).fromJson(jsonStr);

	}

	public static String getGsonStr(Object obj) {
		String result = "";
		try {
			Gson gson = new Gson();
			result = gson.toJson(obj);
		} catch (Exception e) {
			logger.error(e);
		}
		return result;
	}

	/**
	 * 只适用于map类型的json
	 *
	 * 比如： {"extent_parameter_1":"fffff","extent_parameter_2":"fffsffsafds", ...}
	 *
	 * @param jsonStr
	 * @return
	 */
	public static Map<String, String> getMap(String jsonStr) {
		Map<String, String> map = new HashMap<String, String>();

		if(StringUtils.isBlank(jsonStr)) {
			return map;
		}
		JsonParser ja = new JsonParser();
		try {
			JsonElement parse = ja.parse(jsonStr);
			JsonObject asJsonObject = parse.getAsJsonObject();
			Set<Map.Entry<String, JsonElement>> entries = asJsonObject.entrySet();
			Iterator<Map.Entry<String, JsonElement>> iterator = entries.iterator();
			while(iterator.hasNext()) {
				Map.Entry<String, JsonElement> next = iterator.next();
				map.put(next.getKey(), next.getValue().getAsString());
			}
		} catch (JsonSyntaxException e) {
			logger.error(e);
		}

		return map;
	}

	public static void main(String[] args) throws Exception {

		String test = "{\"extent_parameter_1\":\"fffff\",\"extent_parameter_2\":\"fffsffsafds\"}";
		String test1 = "[{extent_parameter_1:fffff,extent_parameter_2:fffsffsafds},{extent_parameter_3:3333ffff}]";
		String test2 = "[a,b,c]";

		Gson gson = new Gson();
//		try {
//			JsonParser ja = new JsonParser();
//			JsonElement parse = ja.parse(test2);
//			JsonObject asJsonObject = parse.getAsJsonObject();
//			Set<Map.Entry<String, JsonElement>> entries = asJsonObject.entrySet();
//			Iterator<Map.Entry<String, JsonElement>> iterator = entries.iterator();
//		} catch (JsonSyntaxException e) {
//			e.printStackTrace();
//		} catch (Exception e) {
//			e.printStackTrace();
//		}

		Map<String, String> map = getMap(test);
		String s = gson.toJson(map);
		String jsonStr = getJsonStr(map);
	}
}
